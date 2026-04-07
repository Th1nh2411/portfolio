import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-ink-100 dark:border-ink-800 mt-24 snap-start">
      <div className="container-narrow py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="font-display font-semibold text-lg tracking-tight">
          <span className="text-accent">T</span>hinh.
        </Link>
        <p className="text-sm text-ink-400 dark:text-ink-500 text-center">
          © {year} Nguyen Duc Thinh · {t('footer.rights')}
        </p>
        <p className="text-xs text-ink-400 dark:text-ink-600 font-mono">{t('footer.built')}</p>
      </div>
    </footer>
  )
}
