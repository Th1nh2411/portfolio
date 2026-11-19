import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * Desktop reading panel for the hero: a dark wash over the text column that eases
 * into the photo with a long, many-stop gradient (smoothstep curve, so there is no
 * visible start/end line), plus a fine film-grain layer that breaks up colour
 * banding. The fade ends at the quote card's right edge.
 */
const ALPHA = 0.62 // darkness over the text column
const FADE = 360 // width of the eased transition (css px)

/** 128×128 monochrome noise tile, generated once. */
function grainTile() {
  const n = 128
  const c = document.createElement('canvas')
  c.width = n
  c.height = n
  const x = c.getContext('2d')!
  const img = x.createImageData(n, n)
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v
    img.data[i + 3] = 255
  }
  x.putImageData(img, 0, 0)
  return c.toDataURL()
}

/** Eased stops: alpha follows 1 - smoothstep from `start` to `start + FADE`. */
function easedGradient(start: number, rgb = '7,8,10') {
  const stops = [`rgba(${rgb},${ALPHA}) 0px`, `rgba(${rgb},${ALPHA}) ${start}px`]
  const N = 12
  for (let k = 1; k <= N; k++) {
    const t = k / N
    const a = ALPHA * (1 - t * t * (3 - 2 * t))
    stops.push(`rgba(${rgb},${a.toFixed(3)}) ${Math.round(start + FADE * t)}px`)
  }
  return `linear-gradient(90deg, ${stops.join(', ')})`
}

export default function HeroScrim() {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(0)

  useEffect(() => {
    const el = ref.current?.parentElement
    if (!el) return
    const measure = () => setW(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const grain = useMemo(() => (typeof document === 'undefined' ? '' : grainTile()), [])
  const rem = 16
  // right edge of the quote card (page gutter + 30rem card); the fade ends there
  const cardEnd = Math.max(2 * rem, (w - 80 * rem) / 2 + 2 * rem) + 30 * rem
  const start = Math.max(0, cardEnd + 200 - FADE) // fade finishes a little past the text
  const mask = easedGradient(start, '0,0,0')

  return (
    <div ref={ref} aria-hidden className="absolute inset-0 pointer-events-none hidden lg:block">
      {w > 0 && (
        <>
          <div className="absolute inset-0" style={{ background: easedGradient(start) }} />
          {/* film grain over the darkened area only, fading out with it */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${grain})`,
              backgroundSize: '128px 128px',
              mixBlendMode: 'overlay',
              opacity: 0.18,
              WebkitMaskImage: mask,
              maskImage: mask,
            }}
          />
        </>
      )}
    </div>
  )
}
