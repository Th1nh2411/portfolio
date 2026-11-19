import { siGithub } from 'simple-icons'

/** GitHub mark (Lucide dropped brand icons). Sized and coloured like a Lucide icon. */
export function GithubIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden className={className} fill="currentColor">
      <path d={siGithub.path} />
    </svg>
  )
}
