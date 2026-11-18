import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useFetch } from '../../hooks'
import { getSkills } from '../../lib/firestore'
import FadeIn from '../common/FadeIn'
import { Skeleton } from '../common/Skeleton'
import TechIcon from '../../game/TechIcon'
import Board from '../common/Board'
import PcbBackdrop from '../pixel/PcbBackdrop'

/**
 * Tech stack as one circuit board: each category is a row ("bus") and every tech
 * is a component chip soldered onto a thin trace. The traces light up when the
 * region is powered by the page circuit.
 */
export default function TechStackSection() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { data: skills, loading } = useFetch(getSkills)
  const total = skills?.reduce((n, s) => n + s.items.length, 0) ?? 0

  return (
    <section id="skills" data-circuit className="py-24 section-edge pcb-host isolate">
      <PcbBackdrop seed="skills" label="U3·TOOLKIT" />
      <div className="container-narrow">
        <FadeIn>
          <p data-lamp className="font-pixel-mono text-xl text-accent tracking-widest uppercase mb-2">
            &gt; {t('about.skills_title')}
          </p>
          <h2 className="section-title mb-4">Toolkit</h2>
          <p className="section-subtitle mb-10 max-w-xl">
            {lang === 'vi'
              ? 'Các công nghệ mình dùng hằng ngày, gắn trên cùng một bo mạch.'
              : 'The parts I build with every day, wired onto one board.'}
          </p>
        </FadeIn>

        {loading ? (
          <Skeleton className="h-80" />
        ) : (
          <FadeIn delay={0.1}>
            <Board tone="sea" pins silk="MB-01 · TOOLKIT">
              <p className="frame-title">
                ▣ BOARD · {String(total).padStart(2, '0')} {lang === 'vi' ? 'LINH KIỆN' : 'PARTS'}
                <span className="frame-dots" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
              </p>

              <div className="divide-y-2 divide-dashed divide-ink-200 dark:divide-ink-700">
                {skills?.map((skill, i) => (
                  <motion.div
                    key={skill.category}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.35 }}
                    className="grid grid-cols-1 md:grid-cols-[190px_1fr] gap-x-6 gap-y-3 px-5 py-5"
                  >
                    {/* Row label */}
                    <div className="flex md:flex-col md:justify-center gap-x-3 gap-y-1 items-baseline md:items-start">
                      <span className="flex items-center gap-2 font-pixel-mono text-xl leading-none uppercase tracking-wide text-ink-900 dark:text-ink-100">
                        <span className="led led-green" />
                        {lang === 'vi' && skill.categoryVi ? skill.categoryVi : skill.category}
                      </span>
                      <span className="font-pixel-mono text-base leading-none text-ink-400 dark:text-ink-500">
                        {String(skill.items.length).padStart(2, '0')} × {lang === 'vi' ? 'LINH KIỆN' : 'PARTS'}
                      </span>
                    </div>

                    {/* Bus with component chips */}
                    <ul className="tech-bus flex flex-wrap gap-x-4 gap-y-3" aria-label={skill.category}>
                      {skill.items.map((item) => (
                        <li key={item} className="tech-chip group">
                          <span className="chip-icon">
                            <TechIcon name={item} scale={1.25} />
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </Board>
          </FadeIn>
        )}
      </div>
    </section>
  )
}
