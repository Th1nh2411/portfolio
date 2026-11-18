import { memo, useEffect, useState, type ReactNode } from 'react'
import { PALETTE, type SpriteDef } from './sprites'
import { ART, artStatus, onArtReady } from './art'

/** Merge each row into horizontal runs of the same colour → few <rect>s. */
function runs(frame: string[], ox = 0) {
  const out: { x: number; y: number; w: number; c: string }[] = []
  frame.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const ch = row[x]
      let end = x + 1
      while (end < row.length && row[end] === ch) end++
      if (ch !== '.' && PALETTE[ch]) out.push({ x: x + ox, y, w: end - x, c: PALETTE[ch] })
      x = end
    }
  })
  return out
}

/** True once the sprite's painted PNG (if any) has loaded. */
function useArt(sprite: SpriteDef) {
  const art = ART.get(sprite)
  const [, bump] = useState(0)
  const st = art ? artStatus(art.src) : 'missing'
  useEffect(() => {
    if (!art || st !== 'loading') return
    return onArtReady(art.src, () => bump((n) => n + 1))
  }, [art, st])
  return st === 'ok' ? art : undefined
}

interface SpriteProps {
  sprite: SpriteDef
  /** Static frame index (ignored when `animate` is set). */
  frame?: number
  /** Loop all frames with CSS steps(), e.g. "0.8s". */
  animate?: string
  scale?: number
  className?: string
  /** Shown when there is neither PNG art nor grid frames. */
  fallback?: ReactNode
}

/**
 * Pixel sprite. Prefers painted PNG art (see art.ts) drawn 1:1; otherwise renders
 * the character grid as crisp SVG. With `animate`, frames sit in one strip and a
 * stepped translate cycles them (no JS timers).
 */
function Sprite({ sprite, frame = 0, animate, scale = 2, className = '', fallback }: SpriteProps) {
  const art = useArt(sprite)
  const { w, h, frames } = sprite
  // Painted art may declare its own frame size; otherwise it matches the grid box.
  const boxW = art?.w ?? w * scale
  const boxH = art?.h ?? h * scale

  let inner: ReactNode
  if (art) {
    const n = art.frames
    inner = (
      <span
        aria-hidden
        style={{
          display: 'block',
          width: boxW * n,
          height: boxH,
          backgroundImage: `url(${art.src})`,
          backgroundSize: '100% 100%',
          imageRendering: 'pixelated',
          ...(animate && n > 1
            ? { animation: `sprite-strip ${animate} steps(${n}) infinite` }
            : { transform: `translateX(${-(frame % n) * boxW}px)` }),
        }}
      />
    )
  } else if (frames.length) {
    const n = animate ? frames.length : 1
    const rects = animate ? frames.flatMap((f, i) => runs(f, i * w)) : runs(frames[frame % frames.length])
    inner = (
      <svg
        width={boxW * n}
        height={boxH}
        viewBox={`0 0 ${w * n} ${h}`}
        shapeRendering="crispEdges"
        aria-hidden
        style={
          animate ? { display: 'block', animation: `sprite-strip ${animate} steps(${n}) infinite` } : { display: 'block' }
        }
      >
        {rects.map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.c} />
        ))}
      </svg>
    )
  } else {
    return <>{fallback ?? null}</>
  }

  return (
    <span className={`inline-block overflow-hidden align-middle ${className}`} style={{ width: boxW, height: boxH }}>
      {inner}
    </span>
  )
}

export default memo(Sprite)
