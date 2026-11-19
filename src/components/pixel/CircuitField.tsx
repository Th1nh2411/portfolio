import { useEffect, useRef } from 'react'

/**
 * Page-wide animated backdrop (a PCB take on a "constellation" background):
 * vias drift slowly; nearby vias are joined by thin traces that route
 * horizontally/vertically first and finish with a 45° leg. The cursor is a probe:
 * a glowing ring that wires itself to the closest vias and makes them light up.
 *
 * Fixed, full-viewport, pointer-events: none, behind all content (z-index -1).
 * Static (single frame) when the visitor prefers reduced motion; pauses when the
 * tab is hidden.
 */

interface Via {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  hot: number // 0..1 glow from the probe
}

const LINK = 115 // max distance for a via-via trace
const PROBE = 190 // probe reach
const DENSITY = 1 / 30000 // vias per px²

function palette() {
  const dark = document.documentElement.classList.contains('dark')
  return dark
    ? { via: 'rgba(170,180,195,0.55)', trace: [122, 162, 255], traceA: 0.1, hot: [107, 155, 255], }
    : { via: 'rgba(59,66,77,0.38)', trace: [100, 115, 140], traceA: 0.1, hot: [47, 95, 208] }
}

export default function CircuitField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current
    const ctx = cv?.getContext('2d')
    if (!cv || !ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Low-end / touch devices: half the vias. Everyone: 30 fps (the drift is slow).
    const nav = navigator as Navigator & { deviceMemory?: number }
    const lowEnd =
      (nav.hardwareConcurrency ?? 8) <= 4 ||
      (nav.deviceMemory ?? 8) <= 4 ||
      window.matchMedia('(pointer: coarse)').matches
    const density = lowEnd ? DENSITY / 2 : DENSITY
    const FRAME = lowEnd ? 1000 / 30 : 0 // full refresh rate unless the device is weak

    let W = 0
    let H = 0
    let dpr = 1
    let vias: Via[] = []
    let pal = palette()
    const mouse = { x: -9999, y: -9999, on: false }
    let raf = 0
    let last = performance.now()

    const seed = () => {
      const n = Math.round(W * H * density)
      vias = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() < 0.18 ? 2.6 : 1.6,
        hot: 0,
      }))
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = window.innerWidth
      H = window.innerHeight
      cv.width = Math.round(W * dpr)
      cv.height = Math.round(H * dpr)
      cv.style.width = `${W}px`
      cv.style.height = `${H}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    /** Orthogonal run then a 45° leg: the PCB version of a straight line. */
    const route = (p: Path2D, x1: number, y1: number, x2: number, y2: number) => {
      const dx = x2 - x1
      const dy = y2 - y1
      p.moveTo(x1, y1)
      if (Math.abs(dx) >= Math.abs(dy)) p.lineTo(x2 - Math.sign(dx) * Math.abs(dy), y1)
      else p.lineTo(x1, y2 - Math.sign(dy) * Math.abs(dx))
      p.lineTo(x2, y2)
    }

    // Traces are batched by alpha bucket: one path + one stroke() per bucket instead of
    // one per pair (stroke calls, not maths, are what cost on weak machines).
    const BUCKETS = 4
    const cold: Path2D[] = []
    const hot: Path2D[] = []

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, W, H)
      const [tr, tg, tb] = pal.trace
      const [hr, hg, hb] = pal.hot

      // move + probe heat
      for (const v of vias) {
        v.x += v.vx * dt
        v.y += v.vy * dt
        if (v.x < -20) v.x = W + 20
        if (v.x > W + 20) v.x = -20
        if (v.y < -20) v.y = H + 20
        if (v.y > H + 20) v.y = -20
        const dx = v.x - mouse.x
        const dy = v.y - mouse.y
        const d2 = mouse.on ? dx * dx + dy * dy : Infinity
        const target = d2 < PROBE * PROBE ? 1 - Math.sqrt(d2) / PROBE : 0
        v.hot += (target - v.hot) * Math.min(1, dt * 0.12)
      }

      for (let k = 0; k < BUCKETS; k++) {
        cold[k] = new Path2D()
        hot[k] = new Path2D()
      }
      const LINK2 = LINK * LINK
      for (let i = 0; i < vias.length; i++) {
        const a = vias[i]
        for (let j = i + 1; j < vias.length; j++) {
          const b = vias[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 > LINK2) continue
          const fade = 1 - Math.sqrt(d2) / LINK
          const heat = Math.max(a.hot, b.hot)
          const bucket = Math.min(BUCKETS - 1, Math.floor(fade * BUCKETS))
          route(heat > 0.05 ? hot[bucket] : cold[bucket], a.x, a.y, b.x, b.y)
        }
      }
      ctx.lineWidth = 1
      for (let k = 0; k < BUCKETS; k++) {
        const f = (k + 0.5) / BUCKETS
        ctx.strokeStyle = `rgba(${tr},${tg},${tb},${pal.traceA * f})`
        ctx.stroke(cold[k])
        ctx.strokeStyle = `rgba(${hr},${hg},${hb},${(pal.traceA + 0.35) * f})`
        ctx.stroke(hot[k])
      }

      // probe wires (the probe itself is the DOM cursor, see ProbeCursor)
      if (mouse.on) {
        const wires = new Path2D()
        let any = false
        for (const v of vias) {
          if (v.hot < 0.08) continue
          route(wires, mouse.x, mouse.y, v.x, v.y)
          any = true
        }
        if (any) {
          ctx.strokeStyle = `rgba(${hr},${hg},${hb},0.4)`
          ctx.lineWidth = 1.2
          ctx.stroke(wires)
        }
      }

      // vias: cold ones in one path; hot ones individually (few)
      const ring = new Path2D()
      for (const v of vias) {
        if (v.hot > 0.05) continue
        ring.moveTo(v.x + v.r + 1, v.y)
        ring.arc(v.x, v.y, v.r + 1, 0, Math.PI * 2)
      }
      ctx.strokeStyle = pal.via
      ctx.lineWidth = 1.2
      ctx.stroke(ring)
      for (const v of vias) {
        if (v.hot <= 0.05) continue
        ctx.fillStyle = `rgba(${hr},${hg},${hb},${0.25 * v.hot})`
        ctx.beginPath()
        ctx.arc(v.x, v.y, v.r + 5 * v.hot, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = `rgba(${hr},${hg},${hb},${0.5 + 0.5 * v.hot})`
        ctx.beginPath()
        ctx.arc(v.x, v.y, v.r + 1, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    // The hero (full-bleed photo) covers the field: skip work while it fills the screen.
    const heroCovers = () => {
      const hero = document.getElementById('home')
      return !!hero && hero.getBoundingClientRect().bottom > window.innerHeight * 0.95
    }

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (document.documentElement.classList.contains('modal-open')) return
      if (now - last < FRAME) return
      const dt = Math.min(96, now - last) / 16.67
      last = now
      if (heroCovers()) return
      draw(dt)
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.on = true
    }
    const onLeave = () => {
      mouse.on = false
    }
    const onVis = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden && !reduce) {
        last = performance.now()
        raf = requestAnimationFrame(loop)
      }
    }
    const themeObs = new MutationObserver(() => {
      pal = palette()
      if (reduce) draw(0)
    })

    resize()
    if (reduce) draw(0)
    else raf = requestAnimationFrame(loop)

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVis)
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVis)
      themeObs.disconnect()
    }
  }, [])

  return <canvas ref={ref} aria-hidden className="circuit-field fixed inset-0 -z-[1] pointer-events-none" />
}
