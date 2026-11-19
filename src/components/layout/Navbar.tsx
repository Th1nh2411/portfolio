import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Moon, Sun } from 'lucide-react'
import { Flag } from '../common/Flag'
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
      // Always solid: toggling the background at the top of the page read as a flicker.
      className={`fixed top-0 left-0 right-0 z-50 bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md border-b transition-colors duration-300 ${
        scrolled ? 'border-ink-200 dark:border-ink-800' : 'border-transparent'
      }`}
    >
      <nav className="container-narrow flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          onClick={(e) => handleLinkClick(e, 'home')}
          className="font-pixel text-2xl leading-none hover:text-accent transition-colors"
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
                className={`font-pixel-mono text-xl leading-none uppercase tracking-wide transition-colors hover:text-accent ${
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
            className="icon-btn gap-1.5 !px-2.5"
            aria-label={i18n.language === 'en' ? 'Chuyển sang tiếng Việt' : 'Switch to English'}
            title={i18n.language === 'en' ? 'Tiếng Việt' : 'English'}
          >
            <Flag code={i18n.language === 'en' ? 'vi' : 'en'} />
            {i18n.language === 'en' ? 'VI' : 'EN'}
          </button>
          <button
            onClick={toggle}
            aria-label={t(`theme.${isDark ? 'light' : 'dark'}`)}
            className="icon-btn !px-0 w-9"
          >
            {isDark ? <Sun size={17} aria-hidden /> : <Moon size={17} aria-hidden />}
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
                    className={`block font-pixel-mono text-2xl uppercase transition-colors hover:text-accent ${
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
