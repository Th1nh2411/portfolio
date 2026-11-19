import { useEffect, useRef, useState } from 'react'
import { Lightbulb, Lock, Power, ToggleRight, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ACHIEVEMENTS, onUnlock, resetGame, unlock, useGame, type Achievement } from './store'
import Sprite from './Sprite'
import { ACHIEVEMENT_ICONS, PIGEON, TROPHY } from './sprites'

const HUD_BOTTOM = 12 // trophy sits at the very bottom; the ✉ button floats above it

/**
 * Global game layer: HUD buttons above the road, achievement toasts,
 * the achievements panel and the "quest complete" celebration.
 */
export default function GameHUD() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'vi' ? 'vi' : 'en'
  const game = useGame()
  const [toasts, setToasts] = useState<(Achievement & { key: number })[]>([])
  const [panel, setPanel] = useState(false)
  const [quest, setQuest] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const trophyRef = useRef<HTMLButtonElement>(null)

  // Toast queue
  useEffect(
    () =>
      onUnlock((a) => {
        const key = Date.now() + Math.random()
        setToasts((t) => [...t, { ...a, key }])
        window.setTimeout(() => setToasts((t) => t.filter((x) => x.key !== key)), 3600)
      }),
    [],
  )

  // Theme + language achievements, detected without touching the Navbar.
  useEffect(() => {
    const root = document.documentElement
    let dark = root.classList.contains('dark')
    const mo = new MutationObserver(() => {
      const now = root.classList.contains('dark')
      if (now !== dark) {
        dark = now
        unlock('night_owl')
      }
    })
    mo.observe(root, { attributes: true, attributeFilter: ['class'] })
    const onLang = () => unlock('polyglot')
    i18n.on('languageChanged', onLang)
    return () => {
      mo.disconnect()
      i18n.off('languageChanged', onLang)
    }
  }, [i18n])

  useEffect(() => {
    const onQuest = () => {
      setQuest((q) => q + 1)
    }
    window.addEventListener('px:quest', onQuest)
    return () => window.removeEventListener('px:quest', onQuest)
  }, [])

  // Close on Esc or on any press outside the panel (the 🏆 button toggles itself).
  useEffect(() => {
    if (!panel) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPanel(false)
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (panelRef.current?.contains(t) || trophyRef.current?.contains(t)) return
      setPanel(false)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [panel])


  const hudBtn = 'dock-btn pointer-events-auto gap-1.5 px-2.5'

  return (
    <>
      {/* HUD, sits just above the road */}
      <div
        className="fixed right-3 z-40 flex gap-2 pointer-events-none"
        style={{ bottom: HUD_BOTTOM }}
      >
        <button ref={trophyRef} className={hudBtn} onClick={() => setPanel((p) => !p)} aria-expanded={panel} aria-label="Achievements">
          <Sprite sprite={TROPHY} scale={2} fallback="🏆" /> {game.achievements.length}/{ACHIEVEMENTS.length}
        </button>
      </div>

      {/* Achievements panel */}
      <AnimatePresence>
        {panel && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="Achievements"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.15, ease: 'linear' }}
            className="fixed right-3 z-50 w-[min(360px,calc(100vw-24px))] max-h-[60vh] flex flex-col bg-ink-950 text-ink-100 border-[3px] border-ink-100 shadow-[6px_6px_0_0_rgb(0_0_0/0.5)]"
            style={{ bottom: HUD_BOTTOM + 96 }}
          >
            <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b-2 border-ink-800">
              <p className="font-pixel text-xl">{lang === 'vi' ? 'THÀNH TÍCH' : 'ACHIEVEMENTS'}</p>
              <button onClick={() => setPanel(false)} className="font-pixel-mono text-xl hover:text-accent" aria-label="Close">
                <X size={16} aria-hidden />
              </button>
            </div>
            <ul className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 space-y-2">
              {ACHIEVEMENTS.map((a) => {
                const got = game.achievements.includes(a.id)
                return (
                  <li
                    key={a.id}
                    className={`flex items-center gap-3 px-2 py-1.5 border-2 ${got ? 'border-accent/70 bg-accent/10' : 'border-ink-800 opacity-60'}`}
                  >
                    <span className={`flex justify-center text-xl w-7 ${got ? '' : 'text-ink-500'}`}>{got ? <Badge a={a} /> : <Lock size={16} aria-hidden />}</span>
                    <span className="min-w-0">
                      <span className="block font-pixel-mono text-lg leading-none">{got ? a.title[lang] : '???'}</span>
                      <span className="block text-xs text-ink-400 mt-0.5">{a.desc[lang]}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
            <div className="shrink-0 px-4 py-2 flex justify-end border-t-2 border-ink-800">
              <button
                onClick={() => {
                  if (window.confirm(lang === 'vi' ? 'Xoá toàn bộ tiến độ?' : 'Reset all progress?')) resetGame()
                }}
                className="font-pixel-mono text-base text-ink-500 hover:text-accent"
              >
                {lang === 'vi' ? 'CHƠI LẠI' : 'RESET'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toasts */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[150] flex flex-col items-center gap-2 pointer-events-none" aria-live="polite">
        <AnimatePresence>
          {toasts.map((a) => (
            <motion.div
              key={a.key}
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
              className="flex items-center gap-3 px-4 py-2.5 bg-ink-950 text-ink-50 border-[3px] border-accent shadow-[4px_4px_0_0_rgb(0_0_0/0.45)]"
            >
              <span className="text-2xl"><Badge a={a} /></span>
              <span>
                <span className="block font-pixel-mono text-base leading-none text-accent">
                  {lang === 'vi' ? 'MỞ KHOÁ THÀNH TÍCH' : 'ACHIEVEMENT UNLOCKED'}
                </span>
                <span className="block font-pixel text-lg leading-tight">{a.title[lang]}</span>
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <QuestComplete play={quest} lang={lang} />
    </>
  )
}

/** Pigeon flies the letter across the screen, then a big banner. */
function QuestComplete({ play: n, lang }: { play: number; lang: 'en' | 'vi' }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!n) return
    setShow(true)
    const t = window.setTimeout(() => setShow(false), 3800)
    return () => {
      window.clearTimeout(t)
    }
  }, [n])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={n}
          className="fixed inset-0 z-[160] pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute"
            initial={{ left: '-10%', top: '80%' }}
            animate={{ left: ['-10%', '35%', '70%', '110%'], top: ['80%', '45%', '35%', '10%'] }}
            transition={{ duration: 3, ease: 'linear', times: [0, 0.35, 0.7, 1] }}
          >
            <Sprite sprite={PIGEON} animate="0.45s" scale={4} />
          </motion.div>
          <motion.div
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.6, 1.1, 1], opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.5, ease: 'easeOut' }}
          >
            <div className="px-8 py-5 bg-ink-950 border-4 border-[#e9c46a] shadow-[8px_8px_0_0_rgb(0_0_0/0.5)] text-center">
              <p className="font-pixel text-4xl md:text-6xl text-[#e9c46a] [text-shadow:3px_3px_0_#2f8f84]">
                QUEST COMPLETE!
              </p>
              <p className="font-pixel-mono text-xl text-ink-200 mt-2">
                {lang === 'vi' ? 'Bồ câu đã mang thư đi. Mình sẽ trả lời sớm!' : 'The pigeon is on its way. I’ll reply soon!'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Hand-drawn badge if Codex supplied one, else the emoji. */
/** Badges without painted art get a matching line icon instead of an emoji. */
const BADGE_ICONS: Record<string, typeof Lock> = { lever: ToggleRight, power_cycle: Power, full_power: Lightbulb }

function Badge({ a }: { a: Achievement }) {
  const art = ACHIEVEMENT_ICONS[a.id]
  const Icon = BADGE_ICONS[a.id]
  const fallback = Icon ? <Icon size={20} aria-hidden className="text-accent" /> : a.icon
  return art ? <Sprite sprite={art} scale={2} fallback={fallback} /> : <>{fallback}</>
}
