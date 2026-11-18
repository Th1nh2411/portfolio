import Sprite from '../../game/Sprite'
import { BIRD, CLOUD_A, CLOUD_B } from '../../game/sprites'

/** Pixel clouds and a few birds drifting across the hero sky (decorative). */
const ITEMS = [
  { sprite: CLOUD_A, scale: 4, top: '6%', dur: 95, delay: -20, opacity: 0.85 },
  { sprite: CLOUD_B, scale: 4, top: '16%', dur: 120, delay: -75, opacity: 0.7 },
  { sprite: CLOUD_A, scale: 4, top: '26%', dur: 140, delay: -110, opacity: 0.55 },
  { sprite: BIRD, scale: 2, top: '12%', dur: 38, delay: -8, opacity: 0.9, flap: '0.42s' },
  { sprite: BIRD, scale: 2, top: '15%', dur: 41, delay: -10, opacity: 0.9, flap: '0.38s' },
  { sprite: BIRD, scale: 2, top: '10%', dur: 44, delay: -13, opacity: 0.8, flap: '0.46s' },
]

export default function HeroSky({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none overflow-hidden ${className}`}>
      {ITEMS.map((it, i) => (
        <span
          key={i}
          className="sky-drift absolute left-0"
          style={{
            top: it.top,
            opacity: it.opacity,
            animation: `sky-drift ${it.dur}s linear ${it.delay}s infinite`,
          }}
        >
          <Sprite sprite={it.sprite} scale={it.scale} animate={it.flap} />
        </span>
      ))}
    </div>
  )
}
