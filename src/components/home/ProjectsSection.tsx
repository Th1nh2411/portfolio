import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFetch } from '../../hooks'
import { getProjects } from '../../lib/firestore'
import ProjectCoverflow from './ProjectCoverflow'
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
          <h2 className="font-heading font-semibold tracking-tight text-4xl md:text-5xl leading-[1.05] text-ink-950 dark:text-ink-50 mb-5">
            {t('projects.title')}
          </h2>
          <p className="section-subtitle mb-8 max-w-xl">
            {t('projects.intro')}
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
                  {tech !== 'All' && <span className="pw inline-flex"><TechIcon name={tech} scale={1} /></span>}
                  {tech}
                </button>
              ))}
            </div>
          </FadeIn>
        )}

        {error && <p className="text-red-500 text-sm py-8 text-center">{t('error')}</p>}

        {loading ? (
          <div className="bento-grid">
            {[1, 2, 3].map(i => <ProjectCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-16 text-ink-400 dark:text-ink-600 text-sm">
            {t('projects.empty')}
          </p>
        ) : (
          <ProjectCoverflow
            key={filter}
            items={filtered}
            indexOf={(p) => (projects ?? []).indexOf(p)}
            onOpen={(proj) => {
              setSelectedProject(proj)
              markProjectSeen(proj.id, projects?.length ?? 0)
            }}
          />
        )}
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  )
}
