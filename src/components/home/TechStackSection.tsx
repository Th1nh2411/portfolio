import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFetch } from '../../hooks'
import { getSkills } from '../../lib/firestore'
import FadeIn from '../common/FadeIn'
import { Skeleton } from '../common/Skeleton'
import TechIcon from '../../game/TechIcon'
import Board from '../common/Board'
import PcbBackdrop from '../pixel/PcbBackdrop'

/**
 * Toolkit: every tech is a part on one board. Icons idle in monochrome; the
 * active group (hovered part, hovered legend chip, or an auto-cycle while the
 * section is powered) lights up in brand colour and its parts get wired together
 * with 45° copper traces.
 */

interface Part {
  name: string
  group: number
}

type Pt = [number, number]

/** Trace from a to b: straight run, then a 45° leg into the target. */
function tracePath([x1, y1]: Pt, [x2, y2]: Pt) {
  const dx = x2 - x1
  const dy = y2 - y1
  if (Math.abs(dx) >= Math.abs(dy)) {
    const mx = x2 - Math.sign(dx) * Math.abs(dy)
    return `M${x1} ${y1}H${mx}L${x2} ${y2}`
  }
  const my = y2 - Math.sign(dy) * Math.abs(dx)
  return `M${x1} ${y1}V${my}L${x2} ${y2}`
}

const CYCLE_MS = 2600

export default function TechStackSection() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { data: skills, loading } = useFetch(getSkills)

  const parts = useMemo<Part[]>(
    () => (skills ?? []).flatMap((s, g) => s.items.map((name) => ({ name, group: g }))),
    [skills],
  )
  const groups = skills?.length ?? 0

  const wrapRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLUListElement>(null)
  const [centers, setCenters] = useState<Pt[]>([])
  const [size, setSize] = useState<[number, number]>([0, 0])
  const [hoverGroup, setHoverGroup] = useState<number | null>(null)
  const [hoverPart, setHoverPart] = useState<number | null>(null)
  const [auto, setAuto] = useState(0)

  // Measure part-pad centres (relative to the wrapper) for the traces.
  const measure = useCallback(() => {
    const wrap = wrapRef.current
    const grid = gridRef.current
    if (!wrap || !grid) return
    const box = wrap.getBoundingClientRect()
    const pts = Array.from(grid.querySelectorAll<HTMLElement>('.tk-pad')).map((el) => {
      const r = el.getBoundingClientRect()
      return [Math.round(r.left - box.left + r.width / 2), Math.round(r.top - box.top + r.height / 2)] as Pt
    })
    setCenters(pts)
    setSize([Math.round(box.width), Math.round(box.height)])
  }, [])

  useLayoutEffect(() => {
    measure()
    const wrap = wrapRef.current
    if (!wrap) return
    const ro = new ResizeObserver(measure)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [measure, parts.length])

  // Auto-cycle through groups while idle (and only while the section is powered).
  useEffect(() => {
    if (!groups) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      if (gridRef.current?.closest('[data-powered]')) setAuto((a) => (a + 1) % groups)
    }, CYCLE_MS)
    return () => window.clearInterval(id)
  }, [groups])

  const partGroup = hoverPart !== null ? parts[hoverPart]?.group : undefined
  const active = hoverGroup ?? partGroup ?? auto
  const userActive = hoverGroup !== null || hoverPart !== null

  // Chain each group's parts in reading order.
  const wires = useMemo(() => {
    const out: { d: string; group: number; i: number }[] = []
    if (!centers.length || centers.length !== parts.length) return out
    for (let g = 0; g < groups; g++) {
      const idx = parts.map((p, i) => (p.group === g ? i : -1)).filter((i) => i >= 0)
      for (let k = 1; k < idx.length; k++) {
        out.push({ d: tracePath(centers[idx[k - 1]], centers[idx[k]]), group: g, i: k })
      }
    }
    return out
  }, [centers, parts, groups])

  const groupName = (g: number) => {
    const s = skills?.[g]
    return s ? (lang === 'vi' && s.categoryVi ? s.categoryVi : s.category) : ''
  }

  return (
    <section id="skills" data-circuit className="py-24 section-edge pcb-host isolate">
      <PcbBackdrop seed="skills" label="U3·TOOLKIT" />
      <div className="container-narrow">
        <FadeIn>
          <p data-lamp className="font-pixel-mono text-xl text-accent tracking-widest uppercase mb-2">
            &gt; {t('about.skills_title')}
          </p>
          <h2 className="section-title mb-4">Toolkit</h2>
          <p className="section-subtitle mb-10 max-w-xl">
            {lang === 'vi'
              ? 'Các linh kiện mình dùng hằng ngày. Rê chuột để xem chúng nối với nhau thế nào.'
              : 'The parts I build with every day. Hover to see how they wire together.'}
          </p>
        </FadeIn>

        {loading ? (
          <Skeleton className="h-[468px]" />
        ) : (
          <FadeIn delay={0.1}>
            <Board tone="sea" pins className="tk-board" silk={`MB-01 · ${String(parts.length).padStart(2, '0')} PARTS`}>
              {/* Legend: one chip per group ("bus") */}
              <div
                className="flex flex-wrap items-center gap-2 px-6 pt-6 pb-2"
                role="group"
                aria-label="Groups"
                onMouseLeave={() => setHoverGroup(null)}
              >
                <span className="font-pixel-mono text-base leading-none text-ink-400 dark:text-ink-500 tracking-widest mr-2">
                  BUS
                </span>
                {skills?.map((s, g) => (
                  <button
                    key={s.category}
                    type="button"
                    onMouseEnter={() => setHoverGroup(g)}
                    onFocus={() => setHoverGroup(g)}
                    onBlur={() => setHoverGroup(null)}
                    onClick={() => setAuto(g)}
                    aria-pressed={active === g}
                    className={`tk-bus ${active === g ? 'is-on' : ''}`}
                  >
                    {groupName(g)}
                    <span className="opacity-60">{String(s.items.length).padStart(2, '0')}</span>
                  </button>
                ))}
              </div>

              {/* Parts grid with traces behind */}
              <div ref={wrapRef} className="relative px-4 pb-8 pt-6 md:px-6">
                <svg className="absolute left-0 top-0 pointer-events-none" width={size[0]} height={size[1]} aria-hidden>
                  {wires.map((w, k) => (
                    <path key={`b${k}`} d={w.d} className="tk-wire-bare" />
                  ))}
                  {wires.map((w, k) =>
                    w.group === active ? (
                      <path
                        key={`l${k}-${active}`}
                        d={w.d}
                        pathLength={1}
                        className="tk-wire-lit is-on"
                        style={{ animationDelay: `${w.i * 90}ms` }}
                      />
                    ) : null,
                  )}
                </svg>

                <ul
                  ref={gridRef}
                  className="relative grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-y-7 gap-x-2"
                  onMouseLeave={() => setHoverPart(null)}
                >
                  {parts.map((p, i) => {
                    const on = p.group === active
                    return (
                      <li
                        key={`${p.group}-${p.name}`}
                        className={`tk-part ${on ? 'is-on' : ''} ${hoverPart === i ? 'is-focus' : ''} ${userActive && !on ? 'is-dim' : ''}`}
                        onMouseEnter={() => setHoverPart(i)}
                        tabIndex={0}
                        onFocus={() => setHoverPart(i)}
                        onBlur={() => setHoverPart(null)}
                        aria-label={`${p.name} (${groupName(p.group)})`}
                      >
                        <span className="tk-pad">
                          <TechIcon name={p.name} scale={2.25} />
                        </span>
                        <span className="tk-name">{p.name}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </Board>
          </FadeIn>
        )}
      </div>
    </section>
  )
}
