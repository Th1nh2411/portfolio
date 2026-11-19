import { useEffect } from 'react'
import { ArrowRight, Download, Quote, Terminal } from 'lucide-react'
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
import HeroScrim from '../components/pixel/HeroScrim'
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
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse') return
          const el = e.currentTarget
          const r = el.getBoundingClientRect()
          el.style.setProperty('--hx', `${e.clientX - r.left}px`)
          el.style.setProperty('--hy', `${e.clientY - r.top}px`)
          el.style.setProperty('--hr', '260px')
        }}
        onPointerLeave={(e) => e.currentTarget.style.setProperty('--hr', '0px')}
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

        {/* Cool colour grade: pulls the warm sunset toward the slate/cobalt palette */}
        <div aria-hidden className="absolute inset-0 pointer-events-none hero-grade" />

        {/* Readability scrims + CRT texture */}
        <div className="hero-scrim absolute inset-x-0 top-0 h-[62svh] lg:h-auto lg:inset-0 pointer-events-none bg-gradient-to-t from-ink-950 via-ink-950/10 to-transparent" />
        <HeroScrim />
        <div className="hero-scrim-photo absolute inset-0 pointer-events-none scanlines opacity-40 lg:opacity-60" />

        {/* HUD: top-right status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0 }}
          className="absolute top-5 right-5 md:right-8 z-10 hidden sm:flex flex-col items-end gap-1 font-pixel-mono text-xl leading-none text-white/90 pointer-events-none"
        >
          <span>
            <span className="text-accent">●</span> AVAILABLE · HCMC
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
              className="font-pixel text-7xl md:text-9xl leading-[0.85] mb-5 [text-shadow:4px_4px_0_#07080a]"
              style={{ fontWeight: 400 }}
            >
              {profile?.name.split(' ').slice(-1)[0] ?? 'Thinh'}
              <span className="text-accent">.</span>
            </motion.h1>

            <motion.h2
              variants={itemVariants}
              className="font-heading font-semibold tracking-tight text-2xl md:text-3xl text-white/90 mb-6"
              style={{ fontWeight: 400 }}
            >
              {lang === 'vi' && profile?.titleVi ? profile.titleVi : (profile?.title ?? t('home.subtitle'))}
            </motion.h2>

            {/* Intro: no card (the hero scrim is the background) — prompt + quote + bio
                with an accent rule on the left */}
            <motion.figure variants={itemVariants} className="hero-intro mb-8 max-w-[30rem]">
              <p className="hero-intro-prompt" aria-hidden>
                <Terminal size={13} /> ~/thinh $ cat README.md
              </p>
              {!profile ? (
                <div aria-hidden className="space-y-3 pt-1 min-h-[88px]">
                  <div className="h-5 w-2/3 bg-white/15" />
                  <div className="h-3 w-full bg-white/10" />
                  <div className="h-3 w-5/6 bg-white/10" />
                </div>
              ) : (
                <>
                  <blockquote className="flex gap-2 font-heading text-lg leading-snug tracking-tight text-white">
                    <Quote size={16} aria-hidden className="shrink-0 mt-1 text-accent-light" />
                    <span>{(lang === 'vi' && profile.taglineVi ? profile.taglineVi : profile.tagline)?.replace(/^["“]|["”]$/g, '')}</span>
                  </blockquote>
                  <figcaption className="mt-2 text-[15px] leading-relaxed text-white/75">
                    {lang === 'vi' && profile.bioVi ? profile.bioVi : profile.bio}
                  </figcaption>
                </>
              )}
            </motion.figure>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-5">
              <button onClick={() => scrollToSection('projects')} className="btn-pixel">
                {t('home.cta_projects')} <ArrowRight size={16} aria-hidden />
              </button>
              {cvUrl && (
                <a href={cvUrl} download target="_blank" rel="noopener noreferrer" className="btn-pixel btn-pixel-ghost">
                  <Download size={16} aria-hidden /> CV
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
                  <dd className="font-pixel text-3xl leading-none text-white [text-shadow:2px_2px_0_#07080a]">{stat.value}</dd>
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
