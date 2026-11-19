import { useCallback, useEffect, useState } from 'react'
import { Play } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { emit, unlock } from './store'

const KEY = 'px.booted'
const LINES = [
  'THINH.OS  v24.11',
  '(C) NGUYEN DUC THINH',
  '',
  'MEMORY CHECK ........ 640K OK',
  'LOADING PORTFOLIO ... OK',
  'MOUNTING PROJECTS ... OK',
  'WIRING REDSTONE ..... OK',
]

function firstVisit() {
  try {
    return localStorage.getItem(KEY) !== '1'
  } catch {
    return false
  }
}

/**
 * First-visit boot sequence ending in PRESS START. While it is up, the page
 * is marked `data-booting` so the hero waits for `px:start` to animate.
 */
export default function BootScreen() {
  const [open, setOpen] = useState(() => {
    const show = firstVisit()
    if (show) document.documentElement.dataset.booting = '1'
    return show
  })
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [shown, setShown] = useState(reduce ? LINES.length : 0)

  useEffect(() => {
    if (!open || shown >= LINES.length) return
    const t = window.setTimeout(() => setShown((n) => n + 1), shown === 0 ? 300 : 170)
    return () => window.clearTimeout(t)
  }, [open, shown])

  const start = useCallback(() => {
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      /* will show again next visit */
    }
    delete document.documentElement.dataset.booting
    setOpen(false)
    emit('px:start')
    window.setTimeout(() => unlock('press_start'), 450)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        start()
      }
      if (e.key === 'Escape') start()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, start])

  const ready = shown >= LINES.length

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-label="Start screen"
          className="fixed inset-0 z-[300] bg-ink-950 text-ink-100 flex items-center justify-center overflow-hidden"
          exit={{ clipPath: ['inset(0 0 0 0)', 'inset(50% 0 50% 0)'] }}
          transition={{ duration: 0.35, ease: [0.7, 0, 0.84, 0] }}
        >
          <div className="absolute inset-0 scanlines opacity-50 pointer-events-none" />
          <button
            onClick={() => start()}
            className="absolute top-4 right-4 font-pixel-mono text-lg text-ink-400 hover:text-accent"
          >
            SKIP
          </button>

          <div className="relative w-full max-w-xl px-6">
            <pre className="font-pixel-mono text-xl md:text-2xl leading-snug text-sea min-h-[11rem] whitespace-pre-wrap">
              {LINES.slice(0, shown).join('\n')}
              {!ready && <span className="animate-blink">█</span>}
            </pre>

            <div className={`mt-8 text-center transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`}>
              <p className="font-pixel text-5xl md:text-7xl text-accent [text-shadow:4px_4px_0_#000] animate-blink mb-8">
                PRESS START
              </p>
              <div className="flex flex-wrap justify-center gap-5">
                <button autoFocus={ready} onClick={start} className="btn-pixel">
                  <Play size={14} fill="currentColor" aria-hidden /> START
                </button>
              </div>
              <p className="font-pixel-mono text-lg text-ink-500 mt-6">[ENTER] TO START</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
