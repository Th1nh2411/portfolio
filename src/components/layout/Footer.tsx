import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer data-circuit className="section-edge">
      <div className="container-narrow py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" data-lamp className="font-pixel text-2xl leading-none">
          <span className="text-accent">T</span>hinh.
        </Link>
        <p className="text-sm text-ink-400 dark:text-ink-500 text-center">
          © {year} Nguyen Duc Thinh · {t('footer.rights')}
        </p>
        <p className="font-pixel-mono text-lg leading-none text-ink-400 dark:text-ink-500">{t('footer.built')}</p>
      </div>
    </footer>
  )
}
