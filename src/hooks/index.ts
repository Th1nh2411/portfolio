import { CACHE_KEYS, readCache } from '../lib/firestore'
import { useState, useEffect } from 'react'

// Theme hook
export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem('theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return { isDark, toggle: () => setIsDark(v => !v) }
}

// Data hook: stale-while-revalidate. Starts from the localStorage cache (if any) so
// repeat visits render real content on the first paint, then swaps in fresh data only
// if it actually changed (no needless re-render / layout shift).
export function useFetch<T>(fetcher: () => Promise<T>) {
  const key = CACHE_KEYS.get(fetcher as () => Promise<unknown>)
  const [data, setData] = useState<T | null>(() => (key ? readCache<T>(key) : null))
  const [loading, setLoading] = useState(() => data === null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetcher()
      .then(result => {
        if (cancelled) return
        setData(prev => (prev !== null && JSON.stringify(prev) === JSON.stringify(result) ? prev : result))
        setLoading(false)
      })
      .catch(err => {
        if (cancelled) return
        setError(err.message || 'Unknown error')
        setLoading(false)
      })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { data, loading, error }
}

// Scroll to top on route change
export function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])
}

// Intersection observer for animations
export function useInView(threshold = 0.1) {
  const [ref, setRef] = useState<HTMLElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!ref) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref, threshold])

  return { ref: setRef, inView }
}
