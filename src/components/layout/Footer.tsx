import { useTranslation } from 'react-i18next'
import { Compass, Download, Link2, Mail } from 'lucide-react'
import { GithubIcon } from '../common/BrandIcon'
import { Link } from 'react-router-dom'
import Board from '../common/Board'
import { useCvUrl } from '../../lib/cv'

const NAV = ['about', 'projects', 'skills', 'contact'] as const

/** Footer as the board's ground plane: brand, quick links, socials, back-to-top. */
export default function Footer() {
  const { t, i18n } = useTranslation()
  const vi = i18n.language === 'vi'
  const year = new Date().getFullYear()
  const cvUrl = useCvUrl()

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const label: Record<(typeof NAV)[number], string> = {
    about: t('nav.about'),
    projects: t('nav.projects'),
    skills: 'Toolkit',
    contact: t('nav.contact'),
  }

  return (
    <footer data-circuit className="section-edge pt-16 pb-10">
      <div className="container-narrow">
        <Board silk="GND · END OF LINE">
          <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr] gap-8 px-6 py-7">
            {/* Brand */}
            <div>
              <Link to="/" data-lamp className="font-pixel text-3xl leading-none">
                <span className="text-accent">T</span>hinh.
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-ink-500 dark:text-ink-400 max-w-xs">
                {vi
                  ? 'Lập trình viên full-stack ở TP.HCM. Đang tìm dự án và đồng đội mới.'
                  : 'Full-stack developer in Ho Chi Minh City. Open to new projects and teams.'}
              </p>
              <p className="mt-4 inline-flex items-center gap-2 font-pixel-mono text-base leading-none text-ink-500 dark:text-ink-400">
                <span className="led led-green" />
                {vi ? 'ĐANG NHẬN VIỆC' : 'AVAILABLE FOR WORK'}
              </p>
            </div>

            {/* Quick links */}
            <nav aria-label="Footer">
              <p className="pm-label !mb-4"><Compass size={15} aria-hidden /> {vi ? 'ĐIỀU HƯỚNG' : 'NAVIGATE'}</p>
              <ul className="grid grid-cols-2 gap-y-3 gap-x-4">
                {NAV.map((id) => (
                  <li key={id}>
                    <button onClick={() => go(id)} className="ft-link">› {label[id]}</button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Links out */}
            <div>
              <p className="pm-label !mb-4"><Link2 size={15} aria-hidden /> {vi ? 'KẾT NỐI' : 'CONNECT'}</p>
              <ul className="space-y-3">
                <li><a className="ft-link" href="https://github.com/Th1nh2411" target="_blank" rel="noopener noreferrer"><GithubIcon size={15} /> GitHub</a></li>
                <li><a className="ft-link" href="mailto:ducthnh2411@gmail.com"><Mail size={15} aria-hidden /> Email</a></li>
                {cvUrl && <li><a className="ft-link" href={cvUrl} download target="_blank" rel="noopener noreferrer"><Download size={15} aria-hidden /> CV</a></li>}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-6 py-4 border-t border-dashed border-ink-200 dark:border-ink-700">
            <p className="text-xs text-ink-400 dark:text-ink-500">© {year} Nguyen Duc Thinh · {t('footer.rights')}</p>
            <p className="font-pixel-mono text-base leading-none text-ink-400 dark:text-ink-500">{t('footer.built')}</p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="ft-link ft-up ml-auto">
              ▲ {vi ? 'LÊN ĐẦU TRANG' : 'BACK TO TOP'}
            </button>
          </div>
        </Board>
      </div>
    </footer>
  )
}
