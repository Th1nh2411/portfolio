/**
 * Tiny chiptune synth: square/saw blips via WebAudio, no audio files.
 * Off by default; the preference persists per browser.
 */
export type Sfx = 'blip' | 'coin' | 'honk' | 'unlock' | 'start' | 'place' | 'quest' | 'error'

type Note = [freq: number, dur: number, wave?: OscillatorType, gap?: number]

const SEQ: Record<Sfx, Note[]> = {
  blip: [[880, 0.05]],
  coin: [[988, 0.07], [1319, 0.22]],
  honk: [[370, 0.12, 'sawtooth', 0.06], [370, 0.22, 'sawtooth']],
  unlock: [[523, 0.08], [659, 0.08], [784, 0.08], [1047, 0.24]],
  start: [[262, 0.09], [330, 0.09], [392, 0.09], [523, 0.09], [659, 0.3]],
  place: [[660, 0.04], [990, 0.07]],
  quest: [[523, 0.1], [523, 0.1], [523, 0.1], [659, 0.28], [587, 0.1], [784, 0.4]],
  error: [[196, 0.12], [147, 0.22]],
}

const KEY = 'px.sound'
const listeners = new Set<() => void>()
let ctx: AudioContext | null = null

export function isSoundOn(): boolean {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function setSoundOn(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? '1' : '0')
  } catch {
    /* storage blocked: preference just won't persist */
  }
  listeners.forEach((l) => l())
}

export function subscribeSound(l: () => void) {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}

export function play(name: Sfx) {
  if (!isSoundOn()) return
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    let t = ctx.currentTime + 0.01
    for (const [freq, dur, wave = 'square', gap = 0] of SEQ[name]) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = wave
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.05, t)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + dur)
      t += dur * 0.92 + gap
    }
  } catch {
    /* no audio support */
  }
}
