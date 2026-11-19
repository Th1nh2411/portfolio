import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Copy } from 'lucide-react'

/** Copy a value to the clipboard; shows a short pixel "COPIED!" tag. */
export default function CopyButton({ value, label }: { value: string; label: string }) {
  const { t } = useTranslation()
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!done) return
    const id = window.setTimeout(() => setDone(false), 1400)
    return () => window.clearTimeout(id)
  }, [done])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Older browsers / insecure context: fall back to a hidden textarea.
      const ta = document.createElement('textarea')
      ta.value = value
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setDone(true)
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${t('actions.copy')} ${label}`}
      title={`${t('actions.copy')} ${label}`}
      className="copy-btn relative inline-flex items-center justify-center shrink-0"
    >
      {done ? <Check size={13} strokeWidth={2.5} aria-hidden /> : <Copy size={13} aria-hidden />}
      <span
        role="status"
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 font-pixel-mono text-sm leading-none px-1.5 py-1 bg-ink-950 text-ink-50 whitespace-nowrap pointer-events-none transition-opacity ${
          done ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {done ? t('actions.copied') : ''}
      </span>
    </button>
  )
}
