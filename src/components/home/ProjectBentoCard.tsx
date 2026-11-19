import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight, ArrowUpRight, Star } from 'lucide-react'
import type { Project } from '../../types'
import TechIcon from '../../game/TechIcon'

interface Props {
  project: Project
  index: number
  size: 'hero' | 'side' | 'normal'
  onOpen: (p: Project) => void
}

const host = (url?: string) => (url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'localhost')

/**
 * Bento project card:
 * - 3D tilt toward the pointer + a cursor-following spotlight (border and fill)
 * - screenshot inside a browser frame; on hover it cycles through the gallery
 * - big outlined index number, tech logos, period, live/details actions
 * All pointer effects are written to CSS variables (no React renders per move).
 */
export default function ProjectBentoCard({ project, index, size, onOpen }: Props) {
  const { t, i18n } = useTranslation()
  const vi = i18n.language === 'vi'
  const ref = useRef<HTMLElement>(null)
  const [shot, setShot] = useState(0)
  const [hover, setHover] = useState(false)

  const title = vi && project.titleVi ? project.titleVi : project.title
  const description = vi && project.descriptionVi ? project.descriptionVi : project.description
  const live = /present|nay|hiện/i.test(project.period)
  const images = project.images?.length ? project.images : []

  // Cycle screenshots while hovered.
  useEffect(() => {
    if (!hover || images.length < 2) return
    const id = window.setInterval(() => setShot((s) => (s + 1) % images.length), 1400)
    return () => window.clearInterval(id)
  }, [hover, images.length])

  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
    if (!reduce) {
      const max = size === 'hero' ? 4 : 6
      el.style.setProperty('--rx', `${(0.5 - y) * max}deg`)
      el.style.setProperty('--ry', `${(x - 0.5) * max}deg`)
    }
  }
  const onLeave = () => {
    const el = ref.current
    if (el) {
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
    }
    setHover(false)
    setShot(0)
  }

  return (
    <article
      ref={ref}
      onPointerMove={onMove}
      onPointerEnter={() => {
        setHover(true)
        images.forEach((src) => { const i = new Image(); i.src = src })
      }}
      onPointerLeave={onLeave}
      onClick={() => onOpen(project)}
      className={`bento group ${size === 'hero' ? 'bento-hero' : ''}`}
    >
      <div className="bento-inner">
        {/* Browser frame with screenshot */}
        <div className="bento-browser">
          <div className="bento-chrome">
            <span className="bento-dots pw" aria-hidden>
              <i />
              <i />
              <i />
            </span>
            <span className="bento-url">{host(project.liveUrl)}</span>
            <span className={`bento-status pw ${live ? 'is-live' : ''}`}>
              <span className="bento-status-dot" aria-hidden />
              {live ? 'LIVE' : 'SHIPPED'}
            </span>
          </div>
          <div className="bento-shot">
            {images.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={i === 0 ? title : ''}
                loading={i === 0 ? 'eager' : 'lazy'}
                draggable={false}
                className={`bento-img ${i === shot ? 'is-on' : ''}`}
              />
            ))}
            {images.length > 1 && (
              <span className="bento-pager" aria-hidden>
                {images.map((_, i) => (
                  <i key={i} className={i === shot ? 'is-on' : ''} />
                ))}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="bento-body">
          <span className="bento-index" aria-hidden>
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="flex items-center gap-2 mb-2 font-pixel-mono text-sm leading-none tracking-widest uppercase text-ink-400 dark:text-ink-500">
            {project.featured && (
              <span className="inline-flex items-center gap-1 text-accent">
                <Star size={11} fill="currentColor" aria-hidden /> Featured ·
              </span>
            )}
            {project.period}
          </div>
          <h3 className="bento-title">{title}</h3>
          <p className={`text-sm leading-relaxed text-ink-500 dark:text-ink-400 ${size === 'hero' ? 'line-clamp-3' : 'line-clamp-2'}`}>
            {description}
          </p>

          <div className="mt-auto pt-5 flex items-center gap-3">
            <ul className="flex items-center gap-1.5" aria-label="Tech stack">
              {project.techStack.slice(0, 5).map((tech) => (
                <li key={tech} className="bento-tech pw" title={tech}>
                  <TechIcon name={tech} scale={1.1} />
                </li>
              ))}
            </ul>
            <span className="ml-auto flex items-center gap-1">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="bento-action"
                  aria-label={`${t('projects.view_live')}: ${title}`}
                >
                  <ArrowUpRight size={16} aria-hidden />
                </a>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onOpen(project)
                }}
                className="bento-action bento-action-main"
              >
                {t('projects.view_details')}
                <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </span>
          </div>
        </div>
        {/* PCB furniture: silkscreen outline, mounting holes, part code */}
        <span className="bento-silk" aria-hidden />
        <span className="board-holes" aria-hidden />
        <span className="bento-code" aria-hidden>
          P-{String(index + 1).padStart(2, '0')} · REV A
        </span>
      </div>
      <span className="board-pins bento-pins" aria-hidden />
    </article>
  )
}
