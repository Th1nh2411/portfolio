import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import FadeIn from '../common/FadeIn'
import type { Project } from '../../types'
import TechIcon from '../../game/TechIcon'
import { play } from '../../game/sound'
import Sprite from '../../game/Sprite'
import { CARTRIDGE } from '../../game/sprites'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  // Cartridge "insert + load" intro before the content shows.
  const [booting, setBooting] = useState(false)

  // Reset index when project changes
  useEffect(() => {
    setCurrentImageIndex(0)
    setPreviewImage(null)
    if (!project) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setBooting(true)
    play('blip')
    const t = window.setTimeout(() => {
      setBooting(false)
      play('coin')
    }, 1100)
    return () => window.clearTimeout(t)
  }, [project?.id])

  // Esc closes (lightbox first)
  useEffect(() => {
    if (!project) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (previewImage) setPreviewImage(null)
      else onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [project, previewImage, onClose])

  // Prevent scroll when modal is open
  useEffect(() => {
    if (project || previewImage) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [project, previewImage])

  if (!project) return null

  const title = lang === 'vi' && project.titleVi ? project.titleVi : project.title
  const detailDescriptions = lang === 'vi' && project.detailDescriptionsVi ? project.detailDescriptionsVi : project.detailDescriptions
  const description = lang === 'vi' && project.descriptionVi ? project.descriptionVi : project.description
  const details = lang === 'vi' && project.detailsVi ? project.detailsVi : project.details
  const responsibilities = lang === 'vi' && project.responsibilitiesVi ? project.responsibilitiesVi : project.responsibilities

  // Portal: sections get CSS filters (circuit power), which would trap position:fixed.
  return createPortal(
    <AnimatePresence>
      {project && (
        <div key="modal" data-powered className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="pixel-frame tone-peach relative w-full max-w-6xl max-h-[85vh] bg-surface-light dark:bg-surface-dark overflow-hidden flex flex-col"
          >
            <AnimatePresence>{booting && <CartridgeIntro title={title} />}</AnimatePresence>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 w-10 h-10 border-2 border-ink-950 dark:border-ink-100 bg-surface-light dark:bg-surface-dark flex items-center justify-center font-pixel-mono text-2xl text-ink-900 dark:text-ink-100 hover:bg-accent hover:text-on-accent transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="overflow-y-auto flex-1">
              <div className="p-6 md:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                  {/* Main content (left column) */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Hero image / Slider */}
                    <div className="relative overflow-hidden aspect-video group bg-ink-100 dark:bg-ink-900 border-[3px] border-ink-950 dark:border-ink-200">
                      {project.images?.length > 1 ? (
                        <>
                          <AnimatePresence mode="popLayout" initial={false}>
                            <motion.img
                              key={currentImageIndex}
                              src={project.images?.[currentImageIndex]}
                              alt={`${title} - image ${currentImageIndex + 1}`}
                              className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
                              initial={{ opacity: 0, x: 40 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -40 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              onClick={() => setPreviewImage(project.images[currentImageIndex])}
                            />
                          </AnimatePresence>

                          {/* Slider Controls */}
                          <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex((prev) => (prev === 0 ? project.images?.length - 1 : prev - 1));
                              }}
                              className="w-10 h-10 border-2 border-ink-50 bg-ink-950/70 text-white font-pixel-mono text-2xl flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition-colors pointer-events-auto"
                              aria-label="Previous image"
                            >
                              ←
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex((prev) => (prev === project.images?.length - 1 ? 0 : prev + 1));
                              }}
                              className="w-10 h-10 border-2 border-ink-50 bg-ink-950/70 text-white font-pixel-mono text-2xl flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition-colors pointer-events-auto"
                              aria-label="Next image"
                            >
                              →
                            </button>
                          </div>

                          {/* Dots */}
                          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10 pointer-events-none">
                            {project.images?.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentImageIndex(idx);
                                }}
                                className={`w-2 h-2 rounded-full transition-all pointer-events-auto ${
                                  idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/75'
                                }`}
                                aria-label={`Go to image ${idx + 1}`}
                              />
                            ))}
                          </div>
                        </>
                      ) : (
                        <img
                          src={project.images?.[0]}
                          alt={title}
                          className="w-full h-full object-cover cursor-zoom-in"
                          onClick={() => setPreviewImage(project.images[0])}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                        <span className="font-pixel-mono text-lg leading-none px-2 py-1 bg-ink-950/75 text-ink-50">{project.period}</span>
                      </div>
                    </div>

                    {/* Header */}
                    <div>
                      <h2 className="font-pixel text-3xl md:text-5xl leading-tight text-ink-950 dark:text-ink-50 mb-4">
                        {title}
                      </h2>
                      {detailDescriptions && detailDescriptions.length > 0 ? (
                        <ul className="space-y-3">
                          {detailDescriptions.map((desc, i) => (
                            <li key={i} className="text-base text-ink-600 dark:text-ink-400 flex items-start gap-3">
                              <span className="mt-2 w-1.5 h-1.5 bg-accent flex-shrink-0" />
                              <span>{desc}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-base text-ink-600 dark:text-ink-400 leading-relaxed font-body">{description}</p>
                      )}
                    </div>

                    {/* Overview */}
                    {details && (
                      <FadeIn>
                        <h3 className="font-pixel text-3xl text-ink-900 dark:text-ink-100 mb-4 tracking-tight">Overview</h3>
                        <p className="text-ink-600 dark:text-ink-400 leading-relaxed font-body">{details}</p>
                      </FadeIn>
                    )}

                    {/* Responsibilities */}
                    {responsibilities && responsibilities.length > 0 && (
                      <FadeIn delay={0.1}>
                        <h3 className="font-pixel text-3xl text-ink-900 dark:text-ink-100 mb-5 tracking-tight">
                          {t('projects.responsibilities')}
                        </h3>
                        <ul className="space-y-3">
                          {responsibilities.map((r, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.07 }}
                              className="flex gap-3 text-ink-600 dark:text-ink-400 text-sm font-body"
                            >
                              <span className="w-5 h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                                {i + 1}
                              </span>
                              {r}
                            </motion.li>
                          ))}
                        </ul>
                      </FadeIn>
                    )}
                  </div>

                  {/* Sidebar (right column) */}
                  <div className="space-y-6">
                    {/* Action buttons */}
                    {(project.liveUrl || project.githubUrl) && (
                      <FadeIn delay={0.15}>
                        <div className="flex gap-3">
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-pixel">
                              {t('projects.view_live')} ↗
                            </a>
                          )}
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-pixel btn-pixel-outline">
                              {t('projects.view_code')}
                            </a>
                          )}
                        </div>
                      </FadeIn>
                    )}

                    <FadeIn delay={0.2}>
                      <div className="pixel-frame tone-sea bg-paper-light dark:bg-paper-dark">
                        <h4 className="frame-title">
                          ▣ EQUIPMENT · {t('projects.tech_stack')}
                        </h4>
                        <ul className="grid grid-cols-2 gap-2 p-5">
                          {project.techStack.map(tech => (
                            <li key={tech} className="tag-pixel justify-start">
                              <span className="icon-slot">
                                <TechIcon name={tech} scale={1} />
                              </span>
                              {tech}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </FadeIn>

                    <FadeIn delay={0.25}>
                      <div className="pixel-frame bg-paper-light dark:bg-paper-dark">
                        <h4 className="frame-title">▣ SAVE DATA</h4>
                        <dl className="space-y-4 p-5">
                          <div className="flex flex-col">
                            <dt className="font-pixel-mono text-base leading-none text-ink-400 dark:text-ink-500 mb-1 uppercase tracking-wider">Period</dt>
                            <dd className="font-pixel-mono text-xl leading-none text-ink-800 dark:text-ink-200">{project.period}</dd>
                          </div>
                          {project.liveUrl && (
                            <div className="flex flex-col">
                              <dt className="font-pixel-mono text-base leading-none text-ink-400 dark:text-ink-500 mb-1 uppercase tracking-wider">Live Preview</dt>
                              <dd>
                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                                  className="text-sm text-accent hover:underline break-all font-medium">
                                  {project.liveUrl.replace('https://', '')}
                                </a>
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    </FadeIn>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Photo Preview Overlay (Lightbox) */}
      <AnimatePresence key="lightbox">
        {previewImage && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewImage(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-zoom-out"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-7xl h-full flex items-center justify-center pointer-events-none"
            >
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-full object-contain shadow-2xl rounded-lg pointer-events-auto"
              />
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-0 right-0 md:-top-12 md:-right-12 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all pointer-events-auto"
              >
                ✕
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AnimatePresence>,
    document.body,
  )
}

/** Cartridge slides into the slot, then a stepped LOADING bar. */
function CartridgeIntro({ title }: { title: string }) {
  return (
    <motion.div
      className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-ink-950 text-ink-100"
      initial={{ opacity: 1 }}
      exit={{ clipPath: ['inset(0 0 0 0)', 'inset(0 0 100% 0)'] }}
      transition={{ duration: 0.25, ease: 'linear' }}
    >
      <div className="absolute inset-0 scanlines opacity-40" />
      {/* Cartridge */}
      <motion.div
        initial={{ y: -180 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.45, ease: (t: number) => Math.floor(t * 6) / 6 }}
        className="relative"
      >
        <Sprite sprite={CARTRIDGE} scale={6} />
        {/* Title over the cartridge label area (cols 4–27, rows 5–14 of the 32×24 grid) */}
        <div className="absolute flex items-center justify-center px-2" style={{ left: '12.5%', top: '20.8%', width: '75%', height: '41.7%' }}>
          <span className="font-pixel text-lg leading-tight text-ink-950 text-center line-clamp-2">{title}</span>
        </div>
      </motion.div>
      {/* Slot */}
      <div className="w-64 h-3 bg-ink-800 border-2 border-ink-600 -mt-1" />

      <p className="font-pixel-mono text-2xl mt-8 tracking-widest">LOADING</p>
      <div className="mt-2 flex gap-1 p-1 border-2 border-ink-300">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.span
            key={i}
            className="w-4 h-4 bg-sea"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 + i * 0.055, duration: 0 }}
          />
        ))}
      </div>
    </motion.div>
  )
}
