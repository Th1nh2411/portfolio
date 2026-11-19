import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * Decorative PCB artwork behind a section (inspired by "Great Wave" circuit-board
 * art): parallel trace buses with 45° bends, vias, via clusters, a hatched copper
 * pour and a silkscreen label. Everything is generated from a seed, so a section
 * always gets the same board. Drawn only in the empty margins around the content.
 *
 * Traces are drawn twice: a dim "bare" layer and a copper layer that draws itself
 * in (stroke-dashoffset) once the host section is powered by the page circuit.
 * The host needs `pcb-host` + `isolate`; this sits at -z-10 inside it.
 */

interface Props {
  seed: string
  /** Kept for call sites; no longer rendered (minimal art). */
  label?: string
}

// ---- tiny seeded RNG ---------------------------------------------------------
function rng(seed: string) {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return (h >>> 0) / 4294967296
  }
}

type Pt = [number, number]
interface Trace {
  pts: Pt[]
  via: boolean
}

const SP = 8 // spacing between parallel traces

/** A horizontal bus that steps up/down with 45° jogs, traces end staggered with vias. */
function hBus(r: () => number, x0: number, x1: number, y0: number, n: number, dir: 1 | -1, yMin: number, yMax: number): Trace[] {
  // shared breakpoints so the bundle stays parallel
  const steps: { x: number; dy: number }[] = []
  let x = x0 + dir * (40 + r() * 120)
  let y = y0
  while (dir > 0 ? x < x1 - 60 : x > x1 + 60) {
    const k = (1 + Math.floor(r() * 3)) * SP * (r() < 0.5 ? -1 : 1)
    const dy = Math.max(yMin - y, Math.min(yMax - y, k))
    if (dy !== 0) steps.push({ x, dy })
    y += dy
    x += dir * (Math.abs(dy) + 60 + r() * 180)
  }
  const out: Trace[] = []
  for (let i = 0; i < n; i++) {
    const off = i * SP
    const end = x1 - dir * (i * (30 + r() * 90) + r() * 60)
    const pts: Pt[] = [[x0, y0 + off]]
    let cy = y0 + off
    for (const s of steps) {
      if (dir > 0 ? s.x >= end : s.x <= end) break
      // offset each trace's corner so the 45° segments stay evenly spaced
      const cx = s.x + dir * (s.dy > 0 ? (n - 1 - i) : i) * SP * 0.41
      pts.push([cx, cy])
      cy += s.dy
      pts.push([cx + dir * Math.abs(s.dy), cy])
    }
    pts.push([end, cy])
    out.push({ pts, via: true })
  }
  return out
}

const d = (pts: Pt[]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${Math.round(x)} ${Math.round(y)}`).join('')

export default function PcbBackdrop({ seed }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState<{ w: number; h: number; cl: number; cr: number } | null>(null)

  useEffect(() => {
    const host = ref.current?.parentElement
    if (!host) return
    const measure = () => {
      const c = host.querySelector<HTMLElement>('.container-narrow')
      const w = host.clientWidth
      const h = host.clientHeight
      // content column inside the host (fallback: centred 1280px column)
      const cl = c ? c.offsetLeft + parseFloat(getComputedStyle(c).paddingLeft) : Math.max(24, (w - 1280) / 2)
      const cr = c ? c.offsetLeft + c.offsetWidth - parseFloat(getComputedStyle(c).paddingRight) : w - cl
      setBox((b) => (b && b.w === w && b.h === h && b.cl === cl && b.cr === cr ? b : { w, h, cl, cr }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(host)
    return () => ro.disconnect()
  }, [])

  const art = useMemo(() => {
    if (!box) return null
    const { w, cl } = box
    const r = rng(seed)
    const traces: Trace[] = []
    const hatch: Pt[][] = []
    const dots: Pt[] = []
    // Minimal: one slim 2-trace bus across the top band of the section.
    traces.push(...hBus(r, cl - 24, w - 16, 30, 2, 1, 22, 50))
    return { traces, hatch, dots }
  }, [box, seed])

  return (
    <div ref={ref} aria-hidden className="pcb-backdrop absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {box && art && (
        <svg width={box.w} height={box.h} className="absolute inset-0">
          <defs>
            <pattern id={`hatch-${seed}`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="7" className="pcb-hatch-line" strokeWidth="3" />
            </pattern>
          </defs>

          {art.hatch.map((poly, i) => (
            <polygon key={i} points={poly.map((p) => p.join(',')).join(' ')} fill={`url(#hatch-${seed})`} className="pcb-pour" />
          ))}

          {/* bare traces */}
          <g className="pcb-bare">
            {art.traces.map((t, i) => (
              <path key={i} d={d(t.pts)} />
            ))}
          </g>
          {/* copper traces: draw in when powered, staggered so the light spreads */}
          <g className="pcb-lit">
            {art.traces.map((t, i) => (
              <path key={i} d={d(t.pts)} pathLength={1} style={{ transitionDelay: `${i * 70}ms` }} />
            ))}
          </g>
          {/* vias at trace ends */}
          <g className="pcb-vias">
            {art.traces.map((t, i) => {
              const [x, y] = t.pts[t.pts.length - 1]
              return <circle key={i} cx={x} cy={y} r={3.5} style={{ transitionDelay: `${300 + i * 70}ms` }} />
            })}
          </g>
          <g className="pcb-dots">
            {art.dots.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={2} />
            ))}
          </g>

        </svg>
      )}
    </div>
  )
}
