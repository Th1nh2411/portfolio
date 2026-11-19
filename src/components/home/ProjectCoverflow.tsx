import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Project } from '../../types'
import ProjectBentoCard from './ProjectBentoCard'

interface Props {
  items: Project[]
  /** index of each project in the full list (for the 01/02/03 numbering) */
  indexOf: (p: Project) => number
  onOpen: (p: Project) => void
}

/**
 * 3D coverflow slider: the active project faces the viewer; neighbours swing back
 * on a curved stage (rotateY + translateZ), dimmed and blurred. Navigate with the
 * arrows, dots, keyboard (←/→), drag/swipe, or by clicking a side card.
 * All slides share one grid cell, so the stage height follows the tallest card.
 */
export default function ProjectCoverflow({ items, indexOf, onOpen }: Props) {
  const [active, setActive] = useState(0)
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)
  const drag = useRef<{ x: number; moved: boolean } | null>(null)
  const n = items.length

  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const go = useCallback((d: number) => setActive((a) => Math.min(n - 1, Math.max(0, a + d))), [n])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
  }

  // drag / swipe
  const onDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, moved: false }
  }
  // a drag that ends as a "click" must not open/select a card
  const suppressClick = useRef(false)
  const onMove = (e: React.PointerEvent) => {
    if (drag.current && Math.abs(e.clientX - drag.current.x) > 8) drag.current.moved = true
  }
  const onUp = (e: React.PointerEvent) => {
    const d = drag.current
    drag.current = null
    if (!d) return
    const dx = e.clientX - d.x
    suppressClick.current = d.moved
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
  }

  // geometry per offset from the active card
  const pose = (offset: number) => {
    const abs = Math.abs(offset)
    const sign = Math.sign(offset)
    const spread = narrow ? 70 : 56 // % of card width between centres
    return {
      x: `${offset * spread}%`,
      z: -abs * (narrow ? 160 : 240),
      rotateY: -sign * Math.min(abs, 2) * (narrow ? 22 : 34),
      scale: abs === 0 ? 1 : 0.82 - (Math.min(abs, 3) - 1) * 0.08, // active card dominates
      opacity: abs > 2 ? 0 : 1 - abs * 0.28,
      filter: abs === 0 ? 'blur(0px) brightness(1)' : `blur(${abs * 1.2}px) brightness(${1 - abs * 0.18})`,
      zIndex: 20 - abs,
    }
  }

  return (
    <div className="cf" onKeyDown={onKey} tabIndex={0} aria-roledescription="carousel" aria-label="Projects">
      <div
        className="cf-stage"
        onPointerDown={onDown}
        // never start the browser's native image/link drag inside the slider
        onDragStart={(e) => e.preventDefault()}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={() => (drag.current = null)}
      >
        {items.map((p, i) => {
          const offset = i - active
          const pz = pose(offset)
          const isActive = offset === 0
          return (
            <motion.div
              key={p.id}
              className={`cf-slide ${isActive ? 'is-active' : ''}`}
              style={{ zIndex: pz.zIndex, pointerEvents: Math.abs(offset) > 2 ? 'none' : 'auto' }}
              initial={false}
              animate={{ x: pz.x, z: pz.z, rotateY: pz.rotateY, scale: pz.scale, opacity: pz.opacity, filter: pz.filter }}
              transition={{ type: 'spring', stiffness: 170, damping: 24, mass: 0.9 }}
              aria-hidden={!isActive}
              // side cards: first click brings them to the front instead of opening
              onClickCapture={(e) => {
                if (suppressClick.current) { suppressClick.current = false; e.stopPropagation(); return }
                if (!isActive) { e.stopPropagation(); e.preventDefault(); setActive(i) }
              }}
            >
              <ProjectBentoCard project={p} index={indexOf(p)} size="normal" onOpen={onOpen} />
            </motion.div>
          )
        })}
      </div>

      {/* floor glow under the active card */}
      <div className="cf-floor" aria-hidden />

      {n > 1 && (
        <div className="cf-controls">
          <button className="cf-arrow" onClick={() => go(-1)} disabled={active === 0} aria-label="Previous project">
            <ChevronLeft size={18} aria-hidden />
          </button>
          <div className="cf-dots" role="tablist">
            {items.map((p, i) => (
              <button
                key={p.id}
                role="tab"
                aria-selected={i === active}
                aria-label={p.title}
                className={`cf-dot ${i === active ? 'is-on' : ''}`}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
          <span className="cf-count">
            SLOT {String(active + 1).padStart(2, '0')} <span className="opacity-50">/ {String(n).padStart(2, '0')}</span>
          </span>
          <button className="cf-arrow" onClick={() => go(1)} disabled={active === n - 1} aria-label="Next project">
            <ChevronRight size={18} aria-hidden />
          </button>
        </div>
      )}
    </div>
  )
}
