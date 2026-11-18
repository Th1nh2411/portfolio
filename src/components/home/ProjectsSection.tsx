import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFetch } from '../../hooks'
import { getProjects } from '../../lib/firestore'
import ProjectCard from '../common/ProjectCard'
import { ProjectCardSkeleton } from '../common/Skeleton'
import FadeIn from '../common/FadeIn'
import ProjectModal from './ProjectModal'
import type { Project } from '../../types'
import { markProjectSeen } from '../../game/store'
import TechIcon from '../../game/TechIcon'
import PcbBackdrop from '../pixel/PcbBackdrop'

export default function ProjectsSection() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState<string>('All')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const { data: projects, loading, error } = useFetch(getProjects)

  const allTechs = ['All', ...Array.from(new Set(projects?.flatMap(p => p.techStack) ?? []))]

  const filtered = filter === 'All'
    ? (projects ?? [])
    : (projects ?? []).filter(p => p.techStack.includes(filter))

  return (
    <section id="projects" data-circuit className="py-24 section-edge section-band pcb-host isolate">
      <PcbBackdrop seed="projects" label="U2·PROJECTS" />
      <div className="container-narrow">
        <FadeIn>
          <p data-lamp className="font-pixel-mono text-xl text-accent tracking-widest uppercase mb-2">
            &gt; {t('projects.subtitle')}
          </p>
          <h2 className="font-pixel text-5xl md:text-6xl leading-none text-ink-950 dark:text-ink-50 mb-5">
            {t('projects.title')}
          </h2>
          <p className="section-subtitle mb-8 max-w-xl">
            A selection of projects I've built — from internal business tools to consumer-facing web apps.
          </p>
        </FadeIn>

        {!loading && (
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap gap-2.5 mb-8" role="group" aria-label="Filter by tech">
              {allTechs.slice(0, 12).map(tech => (
                <button
                  key={tech}
                  onClick={() => setFilter(tech)}
                  aria-pressed={filter === tech}
                  className={`chip ${filter === tech ? 'is-active' : ''}`}
                >
                  {tech !== 'All' && <TechIcon name={tech} scale={1} />}
                  {tech}
                </button>
              ))}
            </div>
          </FadeIn>
        )}

        {error && <p className="text-red-500 text-sm py-8 text-center">{t('error')}</p>}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <ProjectCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-16 text-ink-400 dark:text-ink-600 text-sm">
            No projects match this filter.
          </p>
        ) : (
          <Carousel
            key={filter}
            items={filtered}
            onOpen={(p) => {
              setSelectedProject(p)
              markProjectSeen(p.id, projects?.length ?? 0)
            }}
          />
        )}
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  )
}

/**
 * User-driven carousel: ◀ ▶ buttons, swipe/trackpad, and native scroll snap.
 * Page scroll is never hijacked.
 */
function Carousel({ items, onOpen }: { items: Project[]; onOpen: (p: Project) => void }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState({ index: 0, atStart: true, atEnd: true, perView: 1 })

  const update = useCallback(() => {
    const el = trackRef.current
    const first = el?.firstElementChild as HTMLElement | null
    if (!el || !first) return
    const step = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0')
    setState({
      index: Math.round(el.scrollLeft / step),
      atStart: el.scrollLeft <= 2,
      atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
      perView: Math.max(1, Math.round(el.clientWidth / step)),
    })
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [update])

  const go = (dir: 1 | -1) => {
    const el = trackRef.current
    const first = el?.firstElementChild as HTMLElement | null
    if (!el || !first) return
    el.scrollBy({ left: dir * (first.offsetWidth + 24), behavior: 'smooth' })
  }

  const scrollable = !(state.atStart && state.atEnd)
  const shownTo = Math.min(items.length, state.index + state.perView)

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center justify-between mb-4 font-pixel-mono text-xl leading-none">
        <span className="text-ink-500 dark:text-ink-400" aria-live="polite">
          STAGE {String(state.index + 1).padStart(2, '0')}
          {shownTo > state.index + 1 && `–${String(shownTo).padStart(2, '0')}`}
          <span className="text-ink-300 dark:text-ink-600"> / {String(items.length).padStart(2, '0')}</span>
        </span>
        {scrollable && (
          <div className="flex gap-3">
            <ArrowButton label="Previous projects" disabled={state.atStart} onClick={() => go(-1)}>◀</ArrowButton>
            <ArrowButton label="Next projects" disabled={state.atEnd} onClick={() => go(1)}>▶</ArrowButton>
          </div>
        )}
      </div>

      <div
        ref={trackRef}
        tabIndex={0}
        aria-label="Projects"
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pt-2 pb-5 pl-1 pr-4 -ml-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-accent"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
          if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
        }}
      >
        {items.map((project, i) => (
          <div
            key={project.id}
            className="snap-start shrink-0 w-[85%] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
          >
            <ProjectCard project={project} index={i} onOpen={onOpen} />
          </div>
        ))}
      </div>
    </div>
  )
}

function ArrowButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="btn-pixel btn-pixel-outline !h-9 !px-3 disabled:opacity-35 disabled:pointer-events-none"
    >
      {children}
    </button>
  )
}
