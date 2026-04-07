import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useFetch } from '../../hooks'
import { getProjects } from '../../lib/firestore'
import ProjectCard from '../common/ProjectCard'
import { ProjectCardSkeleton } from '../common/Skeleton'
import FadeIn from '../common/FadeIn'
import ProjectModal from './ProjectModal'
import type { Project } from '../../types'

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
    <section id="projects" className="py-24 border-t border-ink-100 dark:border-ink-800 snap-start">
      <div className="container-narrow">
        <FadeIn>
          <p className="font-mono text-xs text-accent tracking-widest uppercase mb-3">{t('projects.subtitle')}</p>
          <h2 className="section-title mb-6">{t('projects.title')}</h2>
          <p className="section-subtitle mb-12 max-w-xl">
            A selection of projects I've built — from internal business tools to consumer-facing web apps.
          </p>
        </FadeIn>

        {/* Filter chips */}
        {!loading && (
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap gap-2 mb-12">
              {allTechs.slice(0, 12).map(tech => (
                <button
                  key={tech}
                  onClick={() => setFilter(tech)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                    filter === tech
                      ? 'bg-accent text-white border-accent'
                      : 'border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-400 hover:border-accent hover:text-accent'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </FadeIn>
        )}

        {error && (
          <p className="text-red-500 text-sm py-8 text-center">{t('error')}</p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <ProjectCardSkeleton key={i} />)}
          </div>
        ) : (
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={i} 
                onOpen={setSelectedProject}
              />
            ))}
            {filtered.length === 0 && (
              <p className="col-span-3 text-center py-16 text-ink-400 dark:text-ink-600 text-sm">
                No projects match this filter.
              </p>
            )}
          </motion.div>
        )}
      </div>

      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </section>
  )
}
