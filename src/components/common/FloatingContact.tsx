import { useEffect, useState } from 'react'
import { Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/**
 * Floating "Get in touch" button, bottom-right. Hidden while the Contact section
 * (or the footer below it) is on screen, since the form is already right there.
 */
export default function FloatingContact() {
  const { t } = useTranslation()
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const targets = ['contact'].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const footer = document.querySelector('footer')
    if (footer) targets.push(footer)
    if (!targets.length) return
    const visible = new Set<Element>()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)))
        setHidden(visible.size > 0)
      },
      { threshold: 0.15 },
    )
    targets.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <button
      type="button"
      onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
      aria-hidden={hidden}
      aria-label={t('home.cta_contact')}
      tabIndex={hidden ? -1 : 0}
      className={`dock-btn float-cta ${hidden ? 'is-hidden' : ''}`}
    >
      {/* label slides out to the left on hover / keyboard focus */}
      <span className="float-cta-label" aria-hidden>
        {t('home.cta_contact')}
      </span>
      <span className="float-cta-icon" aria-hidden>
        <Mail size={16} strokeWidth={2} />
      </span>
    </button>
  )
}
