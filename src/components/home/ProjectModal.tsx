import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Calendar, ChevronLeft, ChevronRight, Cpu, Layers, Maximize2, Sparkles, Star, X } from 'lucide-react'
import type { Project } from '../../types'
import TechIcon from '../../game/TechIcon'
import { GithubIcon } from '../common/BrandIcon'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

const host = (url?: string) => (url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'localhost')

/**
 * Project detail: a large browser-framed gallery with thumbnails, a header with
 * status and actions, then "what I built" and a sidebar with stack + key facts.
 * Same visual language as the coverflow cards. ←/→ switch images, Esc closes.
 */
export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { t, i18n } = useTranslation()
  const vi = i18n.language === 'vi'
  const [img, setImg] = useState(0)
  const [zoom, setZoom] = useState<string | null>(null)

  useEffect(() => {
    setImg(0)
    setZoom(null)
  }, [project?.id])

  const images = project?.images ?? []
  const step = (d: number) => {
    if (images.length) setImg((i) => (i + d + images.length) % images.length)
  }

  useEffect(() => {
    if (!project) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (zoom) setZoom(null)
        else onClose()
      }
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, zoom, onClose, images.length])

  // lock page scroll without the scrollbar-width jump; pause the background canvas
  useEffect(() => {
    const root = document.documentElement
    if (project) {
      root.style.overflow = 'hidden'
      root.classList.add('modal-open')
    } else {
      root.style.overflow = ''
      root.classList.remove('modal-open')
    }
    return () => {
      root.style.overflow = ''
      root.classList.remove('modal-open')
    }
  }, [project])

  const title = project ? (vi && project.titleVi ? project.titleVi : project.title) : ''
  const description = project ? (vi && project.descriptionVi ? project.descriptionVi : project.description) : ''
  const points = project ? ((vi && project.detailDescriptionsVi ? project.detailDescriptionsVi : project.detailDescriptions) ?? []) : []
  const details = project ? (vi && project.detailsVi ? project.detailsVi : project.details) : undefined
  const responsibilities = project ? ((vi && project.responsibilitiesVi ? project.responsibilitiesVi : project.responsibilities) ?? []) : []
  const live = project ? /present|nay|hiện/i.test(project.period) : false
  // the first bullet is usually the overview sentence
  const [lead, ...rest] = points
  const statusText = live ? (vi ? 'Đang vận hành' : 'In production') : vi ? 'Đã bàn giao' : 'Shipped'

  // Portal: sections get CSS filters (circuit power), which would trap position:fixed.
  return createPortal(
    <>
      <AnimatePresence>
        {project && (
          <div key="pm" data-powered className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6">
            <motion.div
              className="absolute inset-0 bg-ink-950/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.article
              role="dialog"
              aria-modal="true"
              aria-label={title}
              className="pm2 relative w-full max-w-6xl max-h-[92vh] flex flex-col"
              style={{ willChange: 'transform, opacity' }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Title bar (same as every board on the page) */}
              <div className="pm2-bar">
                <span className="inline-flex items-center gap-1.5"><Cpu size={13} aria-hidden /> PROJECT · {project.id.toUpperCase()}</span>
                <span className="frame-dots" aria-hidden><i /><i /><i /></span>
              </div>

              {/* Header */}
              <header className="pm2-head">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className={`pm2-pill ${live ? 'is-live' : ''}`}>
                      <span className="pm2-dot" aria-hidden />
                      {statusText}
                    </span>
                    {project.featured && (
                      <span className="pm2-pill is-accent">
                        <Star size={11} fill="currentColor" aria-hidden /> Featured
                      </span>
                    )}
                    <span className="pm2-pill">
                      <Calendar size={11} aria-hidden /> {project.period}
                    </span>
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl font-semibold tracking-tight text-ink-950 dark:text-ink-50 truncate">{title}</h2>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-pixel btn-pixel-outline hidden sm:inline-flex">
                      <GithubIcon size={15} /> Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-pixel">
                      {t('projects.view_live')} <ArrowUpRight size={15} aria-hidden />
                    </a>
                  )}
                  <button onClick={onClose} className="pm2-close" aria-label="Close">
                    <X size={18} aria-hidden />
                  </button>
                </div>
              </header>

              <div className="pm2-scroll overflow-y-auto overscroll-contain flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6 lg:gap-8 p-4 md:p-6">
                  {/* ---------- Main ---------- */}
                  <div className="min-w-0 space-y-6">
                    {/* Gallery */}
                    <div>
                      <div className="bento-browser !m-0 group/g">
                        <div className="bento-chrome">
                          <span className="bento-dots" aria-hidden><i /><i /><i /></span>
                          <span className="bento-url">{host(project.liveUrl)}</span>
                          <span className="font-heading text-[11px] font-semibold tabular-nums text-ink-500">
                            {String(img + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                          </span>
                        </div>
                        <div className="relative aspect-[16/10] overflow-hidden bg-ink-100 dark:bg-ink-950">
                          <AnimatePresence mode="popLayout" initial={false}>
                            <motion.img
                              key={images[img]}
                              src={images[img]}
                              alt={`${title} – ${img + 1}`}
                              draggable={false}
                              className="absolute inset-0 w-full h-full object-cover object-top cursor-zoom-in"
                              initial={{ opacity: 0, scale: 1.02 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.35 }}
                              onClick={() => setZoom(images[img])}
                            />
                          </AnimatePresence>
                          {images.length > 1 && (
                            <>
                              <button onClick={() => step(-1)} className="pm2-nav left-3" aria-label="Previous image"><ChevronLeft size={18} aria-hidden /></button>
                              <button onClick={() => step(1)} className="pm2-nav right-3" aria-label="Next image"><ChevronRight size={18} aria-hidden /></button>
                            </>
                          )}
                          <button onClick={() => setZoom(images[img])} className="pm2-zoom" aria-label="View full size">
                            <Maximize2 size={14} aria-hidden />
                          </button>
                        </div>
                      </div>
                      {images.length > 1 && (
                        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                          {images.map((src, i) => (
                            <button key={src} onClick={() => setImg(i)} className={`pm2-thumb ${i === img ? 'is-on' : ''}`} aria-label={`Image ${i + 1}`}>
                              <img src={src} alt="" loading="lazy" draggable={false} className="w-full h-full object-cover object-top" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Overview */}
                    <section>
                      <h3 className="pm2-h"><Sparkles size={15} aria-hidden /> {vi ? 'Tổng quan' : 'Overview'}</h3>
                      <p className="text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">{lead ?? details ?? description}</p>
                    </section>

                    {(rest.length > 0 || responsibilities.length > 0) && (
                      <section>
                        <h3 className="pm2-h"><Layers size={15} aria-hidden /> {vi ? 'Mình đã làm gì' : 'What I built'}</h3>
                        <ol className="space-y-3">
                          {[...rest, ...responsibilities].map((p, i) => (
                            <li key={i} className="flex gap-3">
                              <span className="pm2-num">{String(i + 1).padStart(2, '0')}</span>
                              <span className="text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">{p}</span>
                            </li>
                          ))}
                        </ol>
                      </section>
                    )}
                  </div>

                  {/* ---------- Sidebar ---------- */}
                  <aside className="space-y-4 lg:sticky lg:top-0 self-start">
                    <div className="pm2-box">
                      <p className="pm2-box-title">▣ {t('projects.tech_stack')}<span className="ml-auto opacity-60">{String(project.techStack.length).padStart(2, '0')}</span></p>
                      <ul className="space-y-1.5">
                        {project.techStack.map((tech) => (
                          <li key={tech} className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-ink-100/60 dark:hover:bg-white/5">
                            <span className="bento-tech !w-8 !h-8"><TechIcon name={tech} scale={1.15} /></span>
                            <span className="text-sm font-medium text-ink-800 dark:text-ink-100">{tech}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pm2-box">
                      <p className="pm2-box-title">▣ {vi ? 'Thông tin' : 'Save data'}</p>
                      <dl className="text-sm divide-y divide-ink-100 dark:divide-white/5">
                        <div className="pm2-fact"><dt>{vi ? 'Thời gian' : 'Timeline'}</dt><dd>{project.period}</dd></div>
                        <div className="pm2-fact"><dt>{vi ? 'Trạng thái' : 'Status'}</dt><dd>{statusText}</dd></div>
                        <div className="pm2-fact"><dt>Stack</dt><dd>{project.techStack.length} {vi ? 'công nghệ' : 'technologies'}</dd></div>
                        {project.liveUrl && (
                          <div className="pm2-fact">
                            <dt>URL</dt>
                            <dd className="min-w-0">
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline truncate block">{host(project.liveUrl)}</a>
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </aside>
                </div>
              </div>
              {/* PCB furniture */}
              <span className="pm2-silk" aria-hidden />
              <span className="pm2-holes" aria-hidden />
              <span className="pm2-code" aria-hidden>CART · REV A</span>
            </motion.article>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            key="zoom"
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 cursor-zoom-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(null)}
          >
            <motion.img
              src={zoom}
              alt=""
              draggable={false}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            />
            <button onClick={() => setZoom(null)} className="pm2-close absolute top-4 right-4 !text-white !border-white/25" aria-label="Close">
              <X size={18} aria-hidden />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body,
  )
}
