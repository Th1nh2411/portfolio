import { useEffect, useRef } from 'react'

interface PixelPhotoProps {
  src: string
  srcSmall?: string
  alt: string
  /** Horizontal position of the subject inside the source image (0–1). */
  focalX?: number
  /** Where the subject should land on wide screens (0–1 of viewport width). */
  targetX?: number
  /** Fills any area the photo doesn't cover (wide screens). */
  backdrop?: string
  className?: string
}

/** Mosaic block sizes for the intro "rez-in", coarse → sharp. */
const REVEAL_STEPS = [96, 64, 48, 32, 24, 16, 12, 8, 6, 4, 2]
const REVEAL_STEP_MS = 85
/** Size (css px) of one cell of the pointer pixel trail. */
const CELL = 22
const TRAIL_RADIUS = 2
const TRAIL_LIFE_MS = 700

/**
 * Full-bleed photo drawn on a canvas. It "rezzes in" from a coarse mosaic,
 * then leaves a fading trail of pixel cells wherever the pointer moves.
 */
export default function PixelPhoto({
  src,
  srcSmall,
  alt,
  focalX = 0.5,
  targetX = 0.5,
  backdrop = '#16152a',
  className = '',
}: PixelPhotoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const host = canvas?.parentElement
    if (!canvas || !ctx || !host) return
    // Content sits on top of the photo, so track the pointer on the window.

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const img = new Image()
    img.decoding = 'async'
    img.src = srcSmall && window.innerWidth < 768 ? srcSmall : src

    let W = 0
    let H = 0
    let dpr = 1
    const base = document.createElement('canvas') // sharp frame, device px
    const tiny = document.createElement('canvas') // scratch for mosaics
    let cols = 0
    let rows = 0
    let cellColors: Uint8ClampedArray = new Uint8ClampedArray(0)
    const trail = new Map<number, number>() // cell index → life (0–1)
    let revealed = false
    let raf = 0
    let last = 0
    let disposed = false

    const layout = () => {
      const r = host.getBoundingClientRect()
      W = Math.max(1, r.width)
      H = Math.max(1, r.height)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`

      const iw = img.naturalWidth
      const ih = img.naturalHeight
      const wide = W >= 1024
      const tx = wide ? targetX : 0.5
      // Wide: fit height only (no extra zoom) and slide the subject to tx;
      // any gap on the left is filled with the backdrop and blended below.
      // Narrow: plain object-fit: cover.
      const scale = wide ? Math.max(H / ih, (W * 0.55) / iw) : Math.max(W / iw, H / ih)
      const w = iw * scale
      const h = ih * scale
      const x = wide
        ? Math.max(W - w, tx * W - focalX * w) // never leave a gap on the right
        : Math.min(0, Math.max(W - w, tx * W - focalX * w))
      const y = (H - h) / 2

      base.width = canvas.width
      base.height = canvas.height
      const b = base.getContext('2d')!
      b.fillStyle = backdrop
      b.fillRect(0, 0, base.width, base.height)
      b.imageSmoothingQuality = 'high'
      b.drawImage(img, x * dpr, y * dpr, w * dpr, h * dpr)
      if (x > 0) {
        // Stepped (8-bit) fade from the backdrop into the photo's left edge.
        const bands = 12
        const bandW = Math.min(18, w / 3 / bands)
        b.fillStyle = backdrop
        for (let i = 0; i < bands; i++) {
          b.globalAlpha = 1 - (i + 1) / (bands + 1)
          b.fillRect(Math.floor((x + i * bandW) * dpr), 0, Math.ceil(bandW * dpr), base.height)
        }
        b.globalAlpha = 1
      }

      // One averaged colour per trail cell.
      cols = Math.ceil(W / CELL)
      rows = Math.ceil(H / CELL)
      tiny.width = cols
      tiny.height = rows
      const t = tiny.getContext('2d', { willReadFrequently: true })!
      t.imageSmoothingEnabled = true
      t.imageSmoothingQuality = 'high'
      t.drawImage(base, 0, 0, W / CELL, H / CELL)
      cellColors = t.getImageData(0, 0, cols, rows).data
      trail.clear()
    }

    const drawMosaic = (block: number) => {
      const cw = Math.max(1, Math.ceil(W / block))
      const ch = Math.max(1, Math.ceil(H / block))
      const m = document.createElement('canvas')
      m.width = cw
      m.height = ch
      const mc = m.getContext('2d')!
      mc.drawImage(base, 0, 0, cw, ch)
      ctx.imageSmoothingEnabled = false
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(m, 0, 0, cw * block * dpr, ch * block * dpr)
    }

    const drawFrame = (now: number) => {
      const dt = last ? now - last : 16
      last = now
      ctx.imageSmoothingEnabled = true
      ctx.drawImage(base, 0, 0)
      const cs = CELL * dpr
      for (const [i, life] of trail) {
        const next = life - dt / TRAIL_LIFE_MS
        if (next <= 0) {
          trail.delete(i)
          continue
        }
        trail.set(i, next)
        const o = i * 4
        // Quantise opacity into 4 steps so the fade itself looks 8-bit.
        const a = Math.ceil(next * 4) / 4
        ctx.fillStyle = `rgba(${cellColors[o]},${cellColors[o + 1]},${cellColors[o + 2]},${a})`
        const cx = (i % cols) * cs
        const cy = Math.floor(i / cols) * cs
        ctx.fillRect(cx, cy, cs, cs)
      }
      if (trail.size > 0) raf = requestAnimationFrame(drawFrame)
      else {
        raf = 0
        last = 0
      }
    }

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(drawFrame)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!revealed || !cols) return
      const r = canvas.getBoundingClientRect()
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return
      const c = Math.floor((e.clientX - r.left) / CELL)
      const rr = Math.floor((e.clientY - r.top) / CELL)
      for (let dy = -TRAIL_RADIUS; dy <= TRAIL_RADIUS; dy++) {
        for (let dx = -TRAIL_RADIUS; dx <= TRAIL_RADIUS; dx++) {
          const d = Math.abs(dx) + Math.abs(dy) // diamond brush
          if (d > TRAIL_RADIUS) continue
          const x = c + dx
          const y = rr + dy
          if (x < 0 || y < 0 || x >= cols || y >= rows) continue
          const i = y * cols + x
          trail.set(i, Math.max(trail.get(i) ?? 0, 1 - d * 0.25))
        }
      }
      kick()
    }

    const reveal = async () => {
      if (reduceMotion) {
        ctx.drawImage(base, 0, 0)
        revealed = true
        return
      }
      for (const step of REVEAL_STEPS) {
        if (disposed) return
        drawMosaic(step)
        await new Promise((r) => setTimeout(r, REVEAL_STEP_MS))
      }
      if (disposed) return
      ctx.drawImage(base, 0, 0)
      revealed = true
    }

    let resizeTimer = 0
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        if (!img.naturalWidth) return
        layout()
        if (revealed) ctx.drawImage(base, 0, 0)
      }, 120)
    }
    const ro = new ResizeObserver(onResize)

    img.onload = () => {
      if (disposed) return
      layout()
      // Behind the first-visit boot screen: hold on the coarsest mosaic and
      // rez in only once the player presses start.
      if (document.documentElement.dataset.booting) {
        drawMosaic(REVEAL_STEPS[0])
        window.addEventListener('px:start', () => !disposed && reveal(), { once: true })
      } else {
        reveal()
      }
      ro.observe(host)
      if (!reduceMotion) window.addEventListener('pointermove', onPointerMove, { passive: true })
    }

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.clearTimeout(resizeTimer)
      ro.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [src, srcSmall, focalX, targetX, backdrop])

  return (
    <div className={className}>
      <canvas ref={canvasRef} role="img" aria-label={alt} className="block" />
    </div>
  )
}
