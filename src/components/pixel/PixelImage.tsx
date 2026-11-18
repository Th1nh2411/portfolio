import { useEffect, useRef } from 'react'

interface PixelImageProps {
  src: string
  alt: string
  /** Bump this (e.g. on hover) to replay the mosaic → sharp animation. */
  playKey: number
  className?: string
}

const STEPS = [28, 18, 12, 8, 5, 3]
const STEP_MS = 55

/**
 * Regular <img> (lazy, crisp) with a canvas on top that briefly replays a
 * coarse-to-sharp mosaic. Only drawImage is used, so cross-origin images
 * (Cloudinary) work without CORS headers.
 */
export default function PixelImage({ src, alt, playKey, className = '' }: PixelImageProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!playKey) return
    const img = imgRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!img || !canvas || !ctx || !img.complete || !img.naturalWidth) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const W = img.clientWidth
    const H = img.clientHeight
    canvas.width = W
    canvas.height = H

    // Mimic object-fit: cover.
    const s = Math.max(W / img.naturalWidth, H / img.naturalHeight)
    const dw = img.naturalWidth * s
    const dh = img.naturalHeight * s
    const dx = (W - dw) / 2
    const dy = (H - dh) / 2

    const tiny = document.createElement('canvas')
    const tc = tiny.getContext('2d')!
    let cancelled = false
    let i = 0
    let timer = 0

    const tick = () => {
      if (cancelled) return
      if (i >= STEPS.length) {
        canvas.style.opacity = '0'
        return
      }
      const b = STEPS[i++]
      tiny.width = Math.ceil(W / b)
      tiny.height = Math.ceil(H / b)
      tc.drawImage(img, dx / b, dy / b, dw / b, dh / b)
      ctx.imageSmoothingEnabled = false
      ctx.clearRect(0, 0, W, H)
      ctx.drawImage(tiny, 0, 0, tiny.width * b, tiny.height * b)
      canvas.style.opacity = '1'
      timer = window.setTimeout(tick, STEP_MS)
    }
    tick()

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      canvas.style.opacity = '0'
    }
  }, [playKey])

  return (
    <div className={`relative ${className}`}>
      <img ref={imgRef} src={src} alt={alt} loading="lazy" className="w-full h-full object-cover" />
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 w-full h-full pointer-events-none opacity-0"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  )
}
