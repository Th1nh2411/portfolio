import {
  ACHIEVEMENT_ICONS,
  BIRD,
  CARTRIDGE,
  CLOUD_A,
  CLOUD_B,
  MOON,
  PIGEON,
  SOUND_OFF,
  SOUND_ON,
  SUN,
  TROPHY,
  type SpriteDef,
} from './sprites'

/**
 * Painted PNG art that replaces a grid sprite when the file exists in /public.
 *
 * Contract: one frame of the PNG is exactly the size the sprite is DISPLAYED at
 * (grid w/h × the scale its call site uses), so 1 art pixel = 1 CSS pixel and the
 * layout never changes. Frames sit side by side in one horizontal strip.
 */
export interface ArtDef {
  src: string
  /** Display scale used at the call site; frame size = sprite.w × scale by sprite.h × scale. */
  scale: number
  /** Number of frames in the strip (may differ from the grid's frame count). */
  frames: number
  /** Explicit frame size in px when it differs from the grid × scale box. */
  w?: number
  h?: number
}

/** 8×8 grid coin, 4-frame spin (face, ¾, edge, ¾). Used as World Map list bullets. */
export const COIN: SpriteDef = {
  w: 8,
  h: 8,
  frames: [
    [
      '..oooo..',
      '.olleeo.',
      'oleeeeEo',
      'oleEEeEo',
      'oleEEeEo',
      'oeeeeeEo',
      '.oEEEEo.',
      '..oooo..',
    ],
    [
      '...oo...',
      '..olEo..',
      '.oleeEo.',
      '.oleEEo.',
      '.oleEEo.',
      '.oeeeEo.',
      '..oEEo..',
      '...oo...',
    ],
    [
      '...oo...',
      '...lo...',
      '...eo...',
      '...Eo...',
      '...Eo...',
      '...Eo...',
      '...Eo...',
      '...oo...',
    ],
    [
      '...oo...',
      '..oElo..',
      '.oEeelo.',
      '.oEEelo.',
      '.oEEelo.',
      '.oEeeeo.',
      '..oEEo..',
      '...oo...',
    ],
  ],
}

export const ART = new Map<SpriteDef, ArtDef>([
  [PIGEON, { src: '/sprites/pigeon.png', scale: 4, frames: 4, w: 72, h: 52 }], // grid is 24×16, PNG is 72×52
  [SUN, { src: '/sprites/sun.png', scale: 2, frames: 1 }], // 18×18
  [MOON, { src: '/sprites/moon.png', scale: 2, frames: 1 }], // 18×18
  [TROPHY, { src: '/sprites/trophy.png', scale: 2, frames: 1 }], // 18×18
  [SOUND_ON, { src: '/sprites/sound-on.png', scale: 2, frames: 1 }], // 18×18
  [SOUND_OFF, { src: '/sprites/sound-off.png', scale: 2, frames: 1 }], // 18×18
  [CARTRIDGE, { src: '/sprites/cartridge.png', scale: 6, frames: 1 }], // 192×144
  [CLOUD_A, { src: '/sprites/cloud-a.png', scale: 4, frames: 1 }], // 96×40
  [CLOUD_B, { src: '/sprites/cloud-b.png', scale: 4, frames: 1 }], // 96×40
  [BIRD, { src: '/sprites/bird.png', scale: 2, frames: 4 }], // 14×10
  ...Object.entries(ACHIEVEMENT_ICONS).map(
    ([id, def]) => [def, { src: `/sprites/achievements/${id}.png`, scale: 2, frames: 1 }] as const,
  ), // 32×32 each
])

// ---- load-once availability cache ------------------------------------------

type Status = 'loading' | 'ok' | 'missing'
const status = new Map<string, Status>()
const waiters = new Map<string, Set<() => void>>()

export function artStatus(src: string): Status {
  const s = status.get(src)
  if (s) return s
  status.set(src, 'loading')
  const img = new Image()
  const done = (v: Status) => {
    status.set(src, v)
    waiters.get(src)?.forEach((cb) => cb())
    waiters.delete(src)
  }
  img.onload = () => done(img.naturalWidth > 0 ? 'ok' : 'missing')
  img.onerror = () => done('missing')
  img.src = src
  return 'loading'
}

export function onArtReady(src: string, cb: () => void) {
  if (status.get(src) !== 'loading') return () => {}
  let set = waiters.get(src)
  if (!set) waiters.set(src, (set = new Set()))
  set.add(cb)
  return () => {
    set!.delete(cb)
  }
}
