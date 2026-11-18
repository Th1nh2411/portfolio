import { useSyncExternalStore } from 'react'
import { play } from './sound'

/** Player progress, persisted per browser. */
export interface GameState {
  achievements: string[]
  seenProjects: string[]
}

export interface Achievement {
  id: string
  icon: string
  title: { en: string; vi: string }
  desc: { en: string; vi: string }
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'press_start', icon: '🎮', title: { en: 'Press Start', vi: 'Bắt Đầu' }, desc: { en: 'Booted up the site', vi: 'Khởi động trang' } },
  { id: 'chiptune', icon: '🔊', title: { en: 'Chiptune', vi: 'Nhạc 8-bit' }, desc: { en: 'Turned the sound on', vi: 'Bật âm thanh' } },
  { id: 'night_owl', icon: '🌙', title: { en: 'Night Owl', vi: 'Cú Đêm' }, desc: { en: 'Switched the theme', vi: 'Đổi giao diện sáng/tối' } },
  { id: 'polyglot', icon: '🗣️', title: { en: 'Polyglot', vi: 'Song Ngữ' }, desc: { en: 'Changed the language', vi: 'Đổi ngôn ngữ' } },
  { id: 'lever', icon: '🕹️', title: { en: 'Flip the Switch', vi: 'Gạt Cần' }, desc: { en: 'Pulled the power lever', vi: 'Gạt cần nguồn điện' } },
  { id: 'power_cycle', icon: '🔌', title: { en: 'Power Cycle', vi: 'Khởi Động Lại' }, desc: { en: 'Cut the power and brought it back', vi: 'Ngắt điện rồi bật lại' } },
  { id: 'full_power', icon: '💡', title: { en: 'Full Power', vi: 'Thắp Sáng' }, desc: { en: 'Lit up every lamp on the circuit', vi: 'Thắp sáng mọi đèn trên mạch' } },
  { id: 'world_map', icon: '🗺️', title: { en: 'World Map', vi: 'Bản Đồ' }, desc: { en: 'Explored every stage of my career', vi: 'Xem hết các màn kinh nghiệm' } },
  { id: 'curious', icon: '💾', title: { en: 'Curious', vi: 'Tò Mò' }, desc: { en: 'Loaded a project cartridge', vi: 'Mở một băng dự án' } },
  { id: 'completionist', icon: '📚', title: { en: 'Completionist', vi: 'Sưu Tầm' }, desc: { en: 'Loaded every project', vi: 'Mở hết các dự án' } },
  { id: 'messenger', icon: '🕊️', title: { en: 'Messenger', vi: 'Đưa Thư' }, desc: { en: 'Sent me a message', vi: 'Gửi tin nhắn cho mình' } },
]

const KEY = 'px.game.v1'
const EMPTY: GameState = { achievements: [], seenProjects: [] }

function load(): GameState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return EMPTY
    const s = JSON.parse(raw) as Partial<GameState>
    return {
      achievements: Array.isArray(s.achievements) ? s.achievements : [],
      seenProjects: Array.isArray(s.seenProjects) ? s.seenProjects : [],
    }
  } catch {
    return EMPTY
  }
}

let state: GameState = load()
const listeners = new Set<() => void>()
const unlockListeners = new Set<(a: Achievement) => void>()

function commit(next: GameState) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* progress just won't persist */
  }
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}

export function useGame(): GameState {
  return useSyncExternalStore(subscribe, () => state, () => EMPTY)
}

export function getGame() {
  return state
}

export function onUnlock(cb: (a: Achievement) => void) {
  unlockListeners.add(cb)
  return () => {
    unlockListeners.delete(cb)
  }
}

export function unlock(id: string) {
  if (state.achievements.includes(id)) return
  const a = ACHIEVEMENTS.find((x) => x.id === id)
  if (!a) return
  commit({ ...state, achievements: [...state.achievements, id] })
  play('unlock')
  unlockListeners.forEach((cb) => cb(a))
}

export function markProjectSeen(id: string, total: number) {
  unlock('curious')
  if (!state.seenProjects.includes(id)) {
    commit({ ...state, seenProjects: [...state.seenProjects, id] })
  }
  if (total > 0 && state.seenProjects.length >= total) unlock('completionist')
}

export function resetGame() {
  commit(EMPTY)
}

/** Fire-and-forget page events (quest complete, etc.). */
export function emit(name: 'px:quest' | 'px:start') {
  window.dispatchEvent(new CustomEvent(name))
}
