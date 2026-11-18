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
  label: string // silkscreen text, e.g. "U2 · PROJECTS"
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

/** A vertical bus in a side gutter with one or two 45° jogs. */
function vBus(r: () => number, x0: number, y0: number, y1: number, n: number, xMin: number, xMax: number): Trace[] {
  const out: Trace[] = []
  const jogY = y0 + (y1 - y0) * (0.3 + r() * 0.3)
  const dx = Math.max(xMin - x0, Math.min(xMax - x0 - (n - 1) * SP, (r() < 0.5 ? -1 : 1) * SP * (1 + Math.floor(r() * 2))))
  for (let i = 0; i < n; i++) {
    const x = x0 + i * SP
    const end = y1 - i * (24 + r() * 50)
    const pts: Pt[] = [[x, y0]]
    if (Math.abs(dx) > 0 && jogY < end - 40) {
      pts.push([x, jogY])
      pts.push([x + dx, jogY + Math.abs(dx)])
    }
    pts.push([pts[pts.length - 1][0], end])
    out.push({ pts, via: true })
  }
  return out
}

const d = (pts: Pt[]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${Math.round(x)} ${Math.round(y)}`).join('')

export default function PcbBackdrop({ seed, label }: Props) {
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
    const { w, h, cl, cr } = box
    const r = rng(seed)
    const traces: Trace[] = []
    const hatch: Pt[][] = []
    const dots: Pt[] = []
    const rightGutter = w - cr

    // top band (section padding above the content)
    traces.push(...hBus(r, cl - 24, w - 16, 26, 3 + Math.floor(r() * 2), 1, 18, 58))
    // bottom band, running the other way
    traces.push(...hBus(r, w - 8, cl + 40, h - 58, 3, -1, h - 70, h - 34))

    // right gutter: a vertical bus + a hatched copper pour
    if (rightGutter > 56) {
      const gx = cr + 18
      traces.push(...vBus(r, gx, 90, h - 100, Math.min(3, Math.floor((rightGutter - 30) / SP)), cr + 10, w - 12))
      const hx0 = cr + Math.min(28, rightGutter * 0.3)
      const hy0 = h * (0.35 + r() * 0.15)
      const hh = Math.min(220, h * 0.25)
      const c = 10
      hatch.push([
        [hx0 + c, hy0],
        [w + 4, hy0],
        [w + 4, hy0 + hh],
        [hx0, hy0 + hh],
        [hx0, hy0 + c],
      ])
    }

    // via clusters near the top bus end and bottom left
    const cluster = (x: number, y: number, cols: number, rows: number) => {
      for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) dots.push([x + i * 10, y + j * 10])
    }
    cluster(w * (0.55 + r() * 0.2), 72, 4, 2)
    cluster(cl + 60 + r() * 200, h - 30, 5, 1)

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

          {/* silkscreen label, boxed like the title cartouche in the reference */}
          {box.w - box.cr > 56 && (
            <g className="pcb-silk" transform={`translate(${box.w - 28}, 96)`}>
              <rect x={-11} y={-6} width={22} height={label.length * 11 + 12} rx={2} />
              <text x={0} y={0} writingMode="vertical-rl" dominantBaseline="middle">
                {label}
              </text>
            </g>
          )}
        </svg>
      )}
    </div>
  )
}
