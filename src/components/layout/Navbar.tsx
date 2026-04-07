import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../hooks'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { isDark, toggle } = useTheme()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const [activeSection, setActiveSection] = useState<string>('home')

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const handleScrollSpy = (e: any) => {
      if (e.detail) setActiveSection(e.detail)
    }
    window.addEventListener('scrollspy', handleScrollSpy)
    return () => window.removeEventListener('scrollspy', handleScrollSpy)
  }, [])

  useEffect(() => {
    const hashId = location.hash.replace('#', '')
    if (hashId) setActiveSection(hashId)
    else if (location.pathname === '/') setActiveSection('home')
  }, [location.pathname, location.hash])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const links = [
    { to: '/', id: 'home', label: t('nav.home') },
    { to: '/#about', id: 'about', label: t('nav.about') },
    { to: '/#projects', id: 'projects', label: t('nav.projects') },
    { to: '/#contact', id: 'contact', label: t('nav.contact') },
  ]

  const toggleLang = () => {
    const next = i18n.language === 'en' ? 'vi' : 'en'
    i18n.changeLanguage(next)
    localStorage.setItem('lang', next)
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (location.pathname === '/') {
      e.preventDefault()
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        setActiveSection(id)
        setMenuOpen(false)
      }
    }
  }

  const isActive = (link: { to: string; id: string }) => {
    if (location.pathname !== '/') return false
    return activeSection === link.id
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-ink-100 dark:border-ink-800'
          : ''
      }`}
    >
      <nav className="container-narrow flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          onClick={(e) => handleLinkClick(e, 'home')}
          className="font-display font-semibold text-lg tracking-tight hover:text-accent transition-colors"
        >
          <span className="text-accent">T</span>hinh.
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <li key={link.id}>
              <Link
                to={link.to}
                onClick={(e) => handleLinkClick(e, link.id)}
                className={`text-md font-body font-medium transition-colors hover:text-accent ${
                  isActive(link)
                    ? 'text-accent'
                    : 'text-ink-600 dark:text-ink-400'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="text-xs font-mono font-medium px-3 py-1.5 rounded-full border border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-400 hover:border-accent hover:text-accent transition-colors"
          >
            {i18n.language === 'en' ? 'VI' : 'EN'}
          </button>
          <button
            onClick={toggle}
            aria-label={t(`theme.${isDark ? 'light' : 'dark'}`)}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-400 hover:border-accent hover:text-accent transition-colors"
          >
            {isDark ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Mobile burger */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center"
            onClick={() => setMenuOpen(v => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="space-y-1.5">
              <span className={`block w-5 h-0.5 bg-current transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-current transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-current transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-surface-light dark:bg-surface-dark border-b border-ink-100 dark:border-ink-800 px-6 pb-6"
          >
            <ul className="space-y-4 pt-4">
              {links.map(link => (
                <li key={link.id}>
                  <Link
                    to={link.to}
                    onClick={(e) => handleLinkClick(e, link.id)}
                    className={`block text-base font-body font-medium transition-colors hover:text-accent ${
                      isActive(link) ? 'text-accent' : 'text-ink-700 dark:text-ink-300'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>

  )
}
