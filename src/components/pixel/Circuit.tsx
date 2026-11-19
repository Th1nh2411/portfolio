import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useMotionValue, useMotionValueEvent, useSpring } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { unlock } from '../../game/store'

/**
 * Redstone circuit running down the page gutter (Minecraft-style).
 *
 * - The source block + lever sit at the bottom of the hero (`[data-circuit][data-source]`).
 * - Every `[data-lamp]` element gets a lamp on the trunk and a short branch to it.
 * - The signal front follows the scroll (60% down the viewport). When it reaches a
 *   lamp, the lamp lights and the lamp's region (`closest('[data-circuit]')`) gets
 *   `data-powered`, which brings back its colour (see index.css). Scroll up and the
 *   regions below power off again.
 * - The lever cuts power to the whole page.
 */

interface Node {
  y: number // centre of the lamp, page coords
  x: number // where the branch ends (left edge of the anchor − gap)
  region: Element | null
}

interface Geo {
  trunkX: number
  gutterR: number // right limit for trunk jogs (just left of the content)
  sourceY: number
  endY: number
  nodes: Node[]
  height: number
}

type Pt = [number, number]

interface Route {
  pts: Pt[] // monotonic in y: only vertical and 45° segments
  cum: number[] // cumulative length at each point
  total: number
  vias: Pt[] // decorative vias at bends
  spurs: { d: string; end: Pt; y: number }[] // dead-end side traces, lit once the front passes y
}

/** Deterministic pseudo-random in [0,1) from an integer. */
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

/**
 * Trunk route: passes through every node at trunkX, and between nodes wanders
 * sideways with 45° jogs (amount/side picked per gap), so the signal path is not
 * a predictable straight line. Also sprinkles dead-end spurs ending in vias.
 */
function buildRoute(g: Geo): Route {
  const { trunkX: tx, gutterR, sourceY, nodes } = g
  const xMin = 6
  const pts: Pt[] = [[tx, sourceY]]
  const vias: Pt[] = []
  const spurs: Route['spurs'] = []
  const stops = nodes.map((n) => n.y)
  let prev = sourceY
  stops.forEach((y, i) => {
    const gap = y - prev
    if (gap > 180) {
      const room = Math.max(0, gutterR - tx) // to the right of the trunk
      const roomL = Math.max(0, tx - xMin) // to the left
      const goRight = room >= roomL ? hash(i) < 0.75 : hash(i) < 0.25
      const amp = Math.round(Math.min(goRight ? room : roomL, 14 + hash(i + 7) * 30) / 2) * 2
      if (amp >= 6) {
        const a = goRight ? amp : -amp
        const y1 = prev + 30 + Math.round(hash(i + 3) * gap * 0.25)
        const y2 = y - 30 - amp - Math.round(hash(i + 5) * gap * 0.2)
        if (y2 - y1 > amp + 40) {
          pts.push([tx, y1], [tx + a, y1 + amp], [tx + a, y2], [tx, y2 + amp])
          vias.push([tx + a, y1 + amp])
          // a dead-end spur off the jogged run, on the side away from the content
          const sy = Math.round(y1 + amp + (y2 - y1 - amp) * (0.3 + hash(i + 9) * 0.4))
          const sx = tx + a
          const dir = goRight ? -1 : 1
          const len = 10 + Math.round(hash(i + 11) * 12)
          const end: Pt = [sx + dir * len, sy + len + 10]
          spurs.push({ d: `M${sx} ${sy}L${sx + dir * len} ${sy + len}L${end[0]} ${end[1]}`, end, y: sy })
        }
      }
    }
    pts.push([tx, y])
    prev = y
  })
  const cum = [0]
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  }
  return { pts, cum, total: cum[cum.length - 1], vias, spurs }
}

/** Length along the route at page-y `y`, and the point there. */
function lengthAtY(r: Route, y: number): { len: number; pt: Pt } {
  const { pts, cum } = r
  if (y <= pts[0][1]) return { len: 0, pt: pts[0] }
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    if (y <= y1) {
      const t = y1 === y0 ? 1 : (y - y0) / (y1 - y0)
      return { len: cum[i - 1] + (cum[i] - cum[i - 1]) * t, pt: [x0 + (x1 - x0) * t, y] }
    }
  }
  return { len: r.total, pt: pts[pts.length - 1] }
}

const FRONT = 0.6 // signal front, as a fraction of the viewport height

/**
 * Layout position in page coords via the offsetParent chain. Unlike
 * getBoundingClientRect this ignores CSS transforms, so elements that are still
 * sliding in (FadeIn / framer-motion) don't throw the lamps off.
 */
function pagePos(el: HTMLElement) {
  let x = 0
  let y = 0
  let n: HTMLElement | null = el
  while (n) {
    x += n.offsetLeft
    y += n.offsetTop
    n = n.offsetParent as HTMLElement | null
  }
  return { x, y }
}

export default function Circuit() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'vi' ? 'vi' : 'en'
  const layerRef = useRef<HTMLDivElement>(null)
  const [geo, setGeo] = useState<Geo | null>(null)
  const [on, setOn] = useState(true)
  const [lit, setLit] = useState<boolean[]>([])
  const cycled = useRef<'idle' | 'off'>('idle')

  const front = useMotionValue(0) // page-y of the signal front
  const smooth = useSpring(front, { stiffness: 260, damping: 34, mass: 0.5 })

  // ---- geometry ------------------------------------------------------------
  const measure = useCallback(() => {
    const layer = layerRef.current
    if (!layer) return
    const top = pagePos(layer).y
    const src = document.querySelector<HTMLElement>('[data-circuit][data-source]')
    const anchors = Array.from(document.querySelectorAll<HTMLElement>('[data-lamp]'))
    if (!src || !anchors.length) return
    const minLeft = Math.min(...anchors.map((a) => pagePos(a).x))
    const trunkX = Math.max(10, Math.round(minLeft - 40))
    const nodes = anchors
      .map((a) => {
        const p = pagePos(a)
        return {
          y: Math.round(p.y - top + a.offsetHeight / 2),
          x: Math.round(p.x - 8),
          region: a.closest('[data-circuit]'),
        }
      })
      .sort((a, b) => a.y - b.y)
    setGeo({
      trunkX,
      gutterR: Math.round(minLeft - 16),
      sourceY: Math.round(pagePos(src).y + src.offsetHeight - top - 28),
      endY: nodes[nodes.length - 1].y,
      nodes,
      height: layer.offsetHeight,
    })
  }, [])

  useEffect(() => {
    measure()
    const ro = new ResizeObserver(() => measure())
    ro.observe(document.body)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  // ---- signal front follows the scroll ---------------------------------------
  useEffect(() => {
    const update = () => {
      const top = layerRef.current ? pagePos(layerRef.current).y : 0
      const vh = window.innerHeight
      const max = document.documentElement.scrollHeight - vh
      // Over the last screenful of scroll, slide the front from 60% down to the very
      // bottom so the final lamps (footer) can light up too.
      const t = Math.min(1, Math.max(0, (window.scrollY - (max - vh)) / vh))
      front.set(window.scrollY + vh * (FRONT + (1 - FRONT) * t) - top)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [front])

  const applyPower = useCallback(
    (f: number) => {
      if (!geo) return
      const next = geo.nodes.map((n) => on && f >= n.y)
      // Regions: powered when their lamp is lit. The source region follows the lever.
      // Only touch the DOM when a region's state actually changes (this runs every frame).
      const setPowered = (el: Element | null | undefined, v: boolean) => {
        if (!el || el.hasAttribute('data-powered') === v) return
        if (v) el.setAttribute('data-powered', '')
        else el.removeAttribute('data-powered')
      }
      geo.nodes.forEach((n, i) => setPowered(n.region, next[i]))
      setPowered(document.querySelector('[data-circuit][data-source]'), on)

      setLit((prev) => {
        if (prev.length === next.length && prev.every((v, i) => v === next[i])) return prev
        if (next.length && next.every(Boolean)) unlock('full_power')
        return next
      })
    },
    [geo, on],
  )

  useMotionValueEvent(smooth, 'change', applyPower)
  useEffect(() => applyPower(smooth.get()), [applyPower, smooth])

  const route = useMemo(() => (geo ? buildRoute(geo) : null), [geo])
  const litRef = useRef<SVGPathElement>(null)
  const glowRef = useRef<SVGPathElement>(null)
  const headRef = useRef<SVGRectElement>(null)
  const [spursLit, setSpursLit] = useState(0)
  const [bendsLit, setBendsLit] = useState(0)

  // Drive the lit trace imperatively (no React render per scroll frame).
  const paint = useCallback(
    (f: number) => {
      if (!route || !litRef.current) return
      const { len, pt } = on ? lengthAtY(route, f) : { len: 0, pt: route.pts[0] }
      const dash = `${len} ${route.total + 10}`
      litRef.current.setAttribute('stroke-dasharray', dash)
      glowRef.current?.setAttribute('stroke-dasharray', dash)
      if (headRef.current) {
        headRef.current.setAttribute('x', String(pt[0] - 3))
        headRef.current.setAttribute('y', String(pt[1] - 3))
        headRef.current.style.opacity = on && len > 0 && len < route.total ? '1' : '0'
      }
      const n = on ? route.spurs.filter((s) => f >= s.y).length : 0
      setSpursLit((p) => (p === n ? p : n))
      const b = on ? route.vias.filter(([, y]) => f >= y).length : 0
      setBendsLit((p) => (p === b ? p : b))
    },
    [route, on],
  )
  useMotionValueEvent(smooth, 'change', paint)
  useEffect(() => paint(smooth.get()), [paint, smooth])

  const toggle = () => {
    const next = !on
    setOn(next)
    unlock('lever')
    if (!next) cycled.current = 'off'
    else if (cycled.current === 'off') unlock('power_cycle')
  }

  if (!geo || !route) return <div ref={layerRef} className="absolute inset-0 pointer-events-none" aria-hidden />

  const { trunkX, sourceY, nodes } = geo
  const routeD = route.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('')

  return (
    <div ref={layerRef} className="absolute inset-0 pointer-events-none z-[2]">
      {/* Trunk: a wandering 45° trace; the lit copy is revealed with stroke-dasharray */}
      <svg className="absolute left-0 top-0 overflow-visible" width="1" height={geo.height} aria-hidden>
        <path d={routeD} className="circuit-path" />
        {route.spurs.map((s, i) => (
          <g key={i} className={i < spursLit ? 'is-on' : ''}>
            <path d={s.d} className="circuit-spur" />
            <circle cx={s.end[0]} cy={s.end[1]} r={3} className="circuit-via" />
          </g>
        ))}
        {/* bend vias sit UNDER the lit trace (drawn on top they cut it) and light up once passed */}
        {route.vias.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={2.5} className={`circuit-bend ${i < bendsLit ? 'is-on' : ''}`} />
        ))}
        <path ref={glowRef} d={routeD} className="circuit-path-glow" strokeDasharray={`0 ${route.total + 10}`} />
        <path ref={litRef} d={routeD} className="circuit-path-lit" strokeDasharray={`0 ${route.total + 10}`} />
        <rect ref={headRef} width={6} height={6} className="circuit-head-svg" />
      </svg>

      {/* Branches + nodes */}
      {nodes.map((n, i) => {
        const w = Math.max(0, n.x - (trunkX + 5))
        return (
          <div key={i} aria-hidden>
            {w > 0 && (
              <div
                className={`circuit-branch absolute ${lit[i] ? 'is-on' : ''}`}
                style={{ left: trunkX + 5, top: n.y - 1, width: w }}
              />
            )}
            <span className={`circuit-node absolute ${lit[i] ? 'is-on' : ''}`} style={{ left: trunkX - 5, top: n.y - 5 }} />
          </div>
        )
      })}

      {/* Power source: a slim switch at the top of the trunk (bottom of the hero) */}
      <button
        onClick={toggle}
        aria-pressed={on}
        aria-label={lang === 'vi' ? (on ? 'Tắt nguồn điện' : 'Bật nguồn điện') : on ? 'Cut the power' : 'Restore power'}
        title={lang === 'vi' ? 'Công tắc nguồn' : 'Power switch'}
        className={`power-switch absolute pointer-events-auto ${on ? 'is-on' : ''}`}
        style={{ left: trunkX - 9, top: sourceY - 24 }}
      >
        <span className="power-switch-track">
          <span className="power-switch-knob" />
        </span>
        PWR
      </button>
    </div>
  )
}
