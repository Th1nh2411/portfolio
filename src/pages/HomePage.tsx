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
import PixelPhoto from '../components/pixel/PixelPhoto'
import HeroSky from '../components/pixel/HeroSky'
import { useCvUrl } from '../lib/cv'
import TechStackSection from '../components/home/TechStackSection'

export default function HomePage() {
  const { t, i18n } = useTranslation()
  const { hash } = useLocation()
  const lang = i18n.language
  useScrollToTop()

  const { data: profile } = useFetch(getProfile)
  const cvUrl = useCvUrl(profile?.cvUrl)

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
      <section
        id="home"
        data-circuit
        data-source
        className="relative min-h-[calc(100svh-4rem)] flex items-end lg:items-center overflow-hidden snap-start bg-ink-950 text-white"
      >
        <PixelPhoto
          src="/hero.webp"
          srcSmall="/hero-sm.webp"
          alt="Nguyen Duc Thinh by the sea at sunset"
          focalX={0.53}
          targetX={0.68}
          className="absolute inset-x-0 top-0 h-[62svh] lg:h-auto lg:inset-0"
        />

        {/* Drifting pixel clouds + birds over the sky (top of the photo) */}
        <HeroSky className="absolute inset-x-0 top-0 h-[45%] lg:h-[40%]" />

        {/* Readability scrims + CRT texture */}
        <div className="absolute inset-x-0 top-0 h-[62svh] lg:h-auto lg:inset-0 pointer-events-none bg-gradient-to-t from-ink-950 via-ink-950/10 to-transparent lg:bg-gradient-to-r lg:from-ink-950/85 lg:via-ink-950/35 lg:to-transparent" />
        <div className="absolute inset-0 pointer-events-none scanlines opacity-40 lg:opacity-60" />

        {/* HUD: top-right status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0 }}
          className="absolute top-5 right-5 md:right-8 z-10 hidden sm:flex flex-col items-end gap-1 font-pixel-mono text-xl leading-none text-white/90 pointer-events-none"
        >
          <span>
            <span className="text-accent">●</span> REC · HCMC
          </span>
          <span className="text-white/60">LV.2+ FULL-STACK DEV</span>
        </motion.div>

        <div className="container-narrow w-full relative z-10 pb-20 pt-[48svh] lg:py-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xl"
          >
            <motion.p
              variants={itemVariants}
              className="font-pixel-mono text-2xl text-accent-light mb-2 tracking-wide"
            >
              &gt; {t('home.greeting')}
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="font-pixel text-7xl md:text-9xl leading-[0.85] mb-5 [text-shadow:4px_4px_0_#16152a]"
              style={{ fontWeight: 400 }}
            >
              {profile?.name.split(' ').slice(-1)[0] ?? 'Thinh'}
              <span className="text-accent">.</span>
            </motion.h1>

            <motion.h2
              variants={itemVariants}
              className="font-pixel text-2xl md:text-3xl text-white/90 mb-6 [text-shadow:2px_2px_0_#16152a]"
              style={{ fontWeight: 400 }}
            >
              {lang === 'vi' && profile?.titleVi ? profile.titleVi : (profile?.title ?? t('home.subtitle'))}
            </motion.h2>

            {/* RPG dialogue box */}
            <motion.div variants={itemVariants} className="dialog-pixel p-5 mb-9">
              {(profile?.tagline || profile?.taglineVi) && (
                <p className="font-pixel-mono text-xl leading-snug text-accent-light mb-2">
                  {lang === 'vi' && profile?.taglineVi ? profile.taglineVi : profile?.tagline}
                </p>
              )}
              <p className="text-[15px] leading-relaxed text-white/85">
                {lang === 'vi' && profile?.bioVi ? profile.bioVi : profile?.bio}
              </p>
              <span
                aria-hidden
                className="absolute right-3 bottom-2 font-pixel-mono text-xl text-white animate-blink"
              >
                ▼
              </span>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-5">
              <button onClick={() => scrollToSection('projects')} className="btn-pixel">
                ▶ {t('home.cta_projects')}
              </button>
              <button onClick={() => scrollToSection('contact')} className="btn-pixel btn-pixel-ghost">
                {t('home.cta_contact')}
              </button>
              {cvUrl && (
                <a href={cvUrl} download target="_blank" rel="noopener noreferrer" className="btn-pixel btn-pixel-ghost">
                  ⬇ CV
                </a>
              )}
            </motion.div>

            {/* Stats as a game HUD */}
            <motion.dl
              variants={itemVariants}
              className="flex gap-8 mt-12 font-pixel-mono"
            >
              {[
                { value: '2+', label: 'YRS EXP' },
                { value: '3+', label: 'QUESTS' },
                { value: 'HCMC', label: 'BASE' },
              ].map(stat => (
                <div key={stat.label} className="flex flex-col">
                  <dt className="order-2 text-lg text-white/55 leading-none mt-1">{stat.label}</dt>
                  <dd className="font-pixel text-3xl leading-none text-white [text-shadow:2px_2px_0_#16152a]">{stat.value}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>
        </div>

      </section>

      <AboutSection />
      <ProjectsSection />
      <TechStackSection />
      <ContactSection />
    </>
  )
}
