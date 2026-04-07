import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useScrollToTop, useFetch } from '../hooks'
import { getProfile } from '../lib/firestore'
import AboutSection from '../components/home/AboutSection'
import ProjectsSection from '../components/home/ProjectsSection'
import ContactSection from '../components/home/ContactSection'

export default function HomePage() {
  const { t, i18n } = useTranslation()
  const { hash } = useLocation()
  const lang = i18n.language
  useScrollToTop()

  const { data: profile } = useFetch(getProfile)

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }, [hash])

  useEffect(() => {
    const sections = ['home', 'about', 'projects', 'contact']
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Adjust to trigger when section is in the upper part of the viewport
      threshold: 0,
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id
          if (id) {
            // Update URL hash without jumping
            window.history.replaceState(null, '', `#${id === 'home' ? '' : id}`)
            // Dispatch custom event for Navbar
            window.dispatchEvent(new CustomEvent('scrollspy', { detail: id }))
          }
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  }

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <Helmet>
        <title>Nguyen Duc Thinh · Web Developer</title>
        <meta name="description" content="Full-stack web developer based in Ho Chi Minh City" />
      </Helmet>

      {/* Hero */}
      <section id="home" className="min-h-[92vh] flex items-center relative overflow-hidden snap-start">
        {/* Background grid */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          {/* Accent blob */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-1/5 w-64 h-64 bg-accent/5 rounded-full blur-2xl" />
        </div>

        <div className="container-narrow w-full relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={itemVariants}
              className="font-mono text-sm text-accent mb-4 tracking-widest uppercase"
            >
              {t('home.greeting')}
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="font-display text-6xl md:text-8xl font-semibold tracking-tight text-ink-950 dark:text-ink-50 leading-none mb-6"
            >
              {profile?.name.split(' ').slice(-1)[0] ?? 'Thinh'}
              <span className="text-accent">.</span>
            </motion.h1>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl md:text-3xl font-display text-ink-600 dark:text-ink-400 mb-6">
                {lang === 'vi' && profile?.titleVi ? profile.titleVi : (profile?.title ?? t('home.subtitle'))}
              </h2>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-ink-500 dark:text-ink-400 leading-relaxed mb-3 italic"
            >
              {lang === 'vi' && profile?.taglineVi ? profile.taglineVi : profile?.tagline}
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-base text-ink-600 dark:text-ink-400 leading-relaxed mb-10"
            >
              {lang === 'vi' && profile?.bioVi ? profile.bioVi : profile?.bio}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <button onClick={() => scrollToSection('projects')} className="btn-primary">
                {t('home.cta_projects')}
              </button>
              <button onClick={() => scrollToSection('contact')} className="btn-outline">
                {t('home.cta_contact')}
              </button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              variants={itemVariants}
              className="flex gap-10 mt-16 pt-10 border-t border-ink-100 dark:border-ink-800"
            >
              {[
                { value: '2+', label: 'Years Experience' },
                { value: '3+', label: 'Key Projects' },
                { value: 'HCMC', label: 'Based In' },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="font-display text-3xl font-semibold text-ink-900 dark:text-ink-100">{stat.value}</p>
                  <p className="text-sm text-ink-400 dark:text-ink-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink-400 dark:text-ink-600"
        >
          <span className="text-xs font-mono tracking-widest uppercase">{t('home.scroll')}</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-8 bg-gradient-to-b from-accent to-transparent"
          />
        </motion.div>
      </section>

      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </>
  )
}
