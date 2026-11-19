import { useEffect, useRef } from 'react'

/**
 * Custom cursor ("probe"): a dot that tracks the pointer 1:1 and a ring that eases
 * after it. Moved with transform in one rAF loop (no React renders), so it stays
 * smooth at the display's refresh rate. Grows over interactive elements, shows a
 * caret bar over text fields, squeezes on press.
 *
 * Only on fine pointers (mouse/trackpad); touch devices keep the native behaviour.
 * The native cursor is hidden via `html.probe-cursor` (see index.css).
 */
const INTERACTIVE = 'a, button, [role="button"], [role="radio"], [tabindex]:not([tabindex="-1"]), label, summary, select'
const TEXT = 'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]), textarea, [contenteditable="true"]'

export default function ProbeCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.documentElement
    root.classList.add('probe-cursor')

    let x = -100
    let y = -100
    let rx = x
    let ry = y
    let visible = false
    let raf = 0

    const tick = () => {
      // ring eases toward the pointer; snap when close to avoid sub-pixel shimmer
      const k = reduce ? 1 : 0.22
      rx += (x - rx) * k
      ry += (y - ry) * k
      if (Math.abs(x - rx) < 0.1) rx = x
      if (Math.abs(y - ry) < 0.1) ry = y
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = rx === x && ry === y ? 0 : requestAnimationFrame(tick)
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return
      x = e.clientX
      y = e.clientY
      if (!visible) {
        visible = true
        rx = x
        ry = y
        root.classList.add('probe-on')
      }
      kick()
    }
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null
      const text = !!t?.closest?.(TEXT)
      const hot = !text && !!t?.closest?.(INTERACTIVE)
      ring.classList.toggle('is-hot', hot)
      ring.classList.toggle('is-text', text)
      dot.classList.toggle('is-text', text)
    }
    const onDown = () => ring.classList.add('is-down')
    const onUp = () => ring.classList.remove('is-down')
    const onLeave = () => {
      visible = false
      root.classList.remove('probe-on')
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      root.classList.remove('probe-cursor', 'probe-on')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onLeave)
    }
  }, [])

  return (
    <>
      <div ref={ringRef} aria-hidden className="probe-ring" />
      <div ref={dotRef} aria-hidden className="probe-dot" />
    </>
  )
}
