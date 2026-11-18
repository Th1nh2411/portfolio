import { memo } from 'react'
import {
  siAngular,
  siApache,
  siDocker,
  siExpress,
  siFigma,
  siFirebase,
  siGit,
  siJira,
  siLinux,
  siMariadb,
  siMongodb,
  siMysql,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siPostman,
  siReact,
  siSocketdotio,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from 'simple-icons'

/**
 * Original brand logos (simple-icons, CC0) as vector SVG in brand colour.
 * `color` overrides where the official hex is off (e.g. Angular's new near-black mark).
 */
const ICONS: Record<string, { icon: SimpleIcon; color?: string }> = {
  react: { icon: siReact },
  reactjs: { icon: siReact },
  nextjs: { icon: siNextdotjs },
  angular: { icon: siAngular, color: '#dd0031' },
  angularjs: { icon: siAngular, color: '#dd0031' },
  typescript: { icon: siTypescript },
  tailwindcss: { icon: siTailwindcss },
  tailwind: { icon: siTailwindcss },
  nestjs: { icon: siNestjs },
  express: { icon: siExpress },
  expressjs: { icon: siExpress },
  node: { icon: siNodedotjs },
  nodejs: { icon: siNodedotjs },
  mysql: { icon: siMysql },
  mariadb: { icon: siMariadb },
  mongodb: { icon: siMongodb },
  firebase: { icon: siFirebase },
  firebasehosting: { icon: siFirebase },
  linux: { icon: siLinux, color: '#16152a' },
  linuxserver: { icon: siLinux, color: '#16152a' },
  apache: { icon: siApache },
  docker: { icon: siDocker },
  git: { icon: siGit },
  postman: { icon: siPostman },
  figma: { icon: siFigma },
  jira: { icon: siJira },
  socketio: { icon: siSocketdotio },
}

/** Techs with no logo get a short text badge. */
const LABELS: Record<string, string> = {
  restapi: 'API',
  cms: 'CMS',
  virtualaccountapi: 'VA',
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

function initials(name: string) {
  const words = name.toUpperCase().replace(/[^A-Z0-9 ]/g, ' ').split(/\s+/).filter(Boolean)
  return (words.length > 1 ? words.map((w) => w[0]).join('') : (words[0] ?? '?')).slice(0, 3)
}

interface TechIconProps {
  name: string
  /** 16px × scale = rendered size. */
  scale?: number
  className?: string
}

function TechIcon({ name, scale = 1, className = '' }: TechIconProps) {
  const key = norm(name)
  const size = 16 * scale
  const entry = ICONS[key]

  if (!entry) {
    const text = LABELS[key] ?? initials(name)
    return (
      <span
        aria-hidden
        className={`shrink-0 inline-flex items-center justify-center font-pixel-mono leading-none text-accent ${className}`}
        style={{ width: size, height: size, fontSize: size * (text.length > 2 ? 0.62 : 0.8) }}
      >
        {text}
      </span>
    )
  }

  return (
    <svg aria-hidden viewBox="0 0 24 24" width={size} height={size} className={`shrink-0 ${className}`}>
      <path d={entry.icon.path} fill={entry.color ?? `#${entry.icon.hex}`} />
    </svg>
  )
}

export default memo(TechIcon)
