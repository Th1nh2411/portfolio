import { useEffect, useState } from 'react'

/**
 * Resolve the CV link: `profile.cvUrl` (Firestore) if set, else `/cv.pdf` in /public.
 * Returns null until the file is confirmed to be a PDF. Hosting/dev servers answer
 * missing paths with index.html (SPA rewrite), so a 200 alone proves nothing.
 */
export function useCvUrl(profileUrl?: string) {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    const candidate = profileUrl || '/cv.pdf'
    // External links (Drive, Dropbox…) can't be probed cross-origin; trust them.
    if (/^https?:\/\//.test(candidate) && !candidate.startsWith(window.location.origin)) {
      setUrl(candidate)
      return
    }
    let alive = true
    fetch(candidate, { method: 'HEAD' })
      .then((r) => {
        if (alive && r.ok && (r.headers.get('content-type') ?? '').includes('pdf')) setUrl(candidate)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [profileUrl])
  return url
}
