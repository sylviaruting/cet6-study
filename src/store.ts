import { useSyncExternalStore } from 'react'
import { idbGet, idbSet } from './lib/idb'
import type {
  AppState,
  Mistake,
  ModuleId,
  PaperProgress,
  PersistInfo,
  WordProgress,
} from './types'

const KEY = 'cet6-study-v1'

function today() {
  return new Date().toISOString().slice(0, 10)
}

function addDays(date: string, days: number) {
  const d = new Date(date + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function emptyProgress(): AppState['progress'] {
  return {
    listening: {},
    reading: {},
    translation: {},
    matching: {},
    writing: {},
  }
}

function defaultState(): AppState {
  return {
    profile: {
      name: 'Sylvia',
      targetScore: 500,
      examDate: '2026-12-12',
    },
    streak: { lastDate: '', count: 0, history: [] },
    progress: emptyProgress(),
    words: {},
    mistakes: [],
    daily: { date: today(), wordsReviewed: 0, papersDone: 0, minutes: 0 },
    planChecks: {},
    updatedAt: '',
  }
}

function contentScore(s: AppState) {
  const papers = Object.values(s.progress).reduce(
    (n, module) => n + Object.keys(module).length,
    0,
  )
  return (
    papers * 8 +
    Object.keys(s.words).length * 2 +
    s.mistakes.length * 3 +
    s.streak.count * 10 +
    Object.keys(s.planChecks ?? {}).length
  )
}

function normalize(raw: unknown): AppState | null {
  if (!raw || typeof raw !== 'object') return null
  const input = raw as Partial<AppState>
  const parsed: AppState = {
    ...defaultState(),
    ...input,
    profile: { ...defaultState().profile, ...input.profile },
    streak: { ...defaultState().streak, ...input.streak },
    progress: { ...emptyProgress(), ...input.progress },
    words: input.words ?? {},
    mistakes: Array.isArray(input.mistakes) ? input.mistakes : [],
    daily: { ...defaultState().daily, ...input.daily },
    planChecks: input.planChecks ?? {},
    updatedAt: input.updatedAt ?? '',
  }
  if (parsed.daily.date !== today()) {
    parsed.daily = { date: today(), wordsReviewed: 0, papersDone: 0, minutes: 0 }
  }
  return parsed
}

function pickBetter(a: AppState | null, b: AppState | null): AppState {
  if (!a) return b ?? defaultState()
  if (!b) return a
  const ca = contentScore(a)
  const cb = contentScore(b)
  if (ca !== cb) return ca > cb ? a : b
  const ta = Date.parse(a.updatedAt || '') || 0
  const tb = Date.parse(b.updatedAt || '') || 0
  return ta >= tb ? a : b
}

function loadLocal(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    return normalize(raw ? JSON.parse(raw) : null) ?? defaultState()
  } catch {
    return defaultState()
  }
}

let state = loadLocal()
const listeners = new Set<() => void>()
let persistSnap: PersistInfo = {
  status: 'idle',
  lastSavedAt: state.updatedAt,
  hydrated: false,
}
let hydratePromise: Promise<void> | null = null
let writeChain = Promise.resolve()
let latestPayload: AppState = state

function notify() {
  listeners.forEach((fn) => fn())
}

function setPersist(patch: Partial<PersistInfo>) {
  persistSnap = { ...persistSnap, ...patch }
  notify()
}

function persistLocal(payload = state) {
  localStorage.setItem(KEY, JSON.stringify(payload))
  void idbSet(payload)
}

async function postToDb(payload: AppState) {
  const res = await fetch('/api/db', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  })
  if (!res.ok) throw new Error('db write failed')
}

function flushToDisk(payload: AppState) {
  latestPayload = payload
  persistLocal(payload)
  if (!persistSnap.hydrated) return
  setPersist({ status: 'saving', lastSavedAt: payload.updatedAt, hydrated: true })
  writeChain = writeChain
    .then(async () => {
      const data = latestPayload
      await postToDb(data)
      setPersist({ status: 'saved', lastSavedAt: data.updatedAt, hydrated: true })
    })
    .catch(() => {
      setPersist({ status: 'local-only', lastSavedAt: latestPayload.updatedAt, hydrated: true })
    })
}

function emitChange() {
  persistLocal()
  notify()
  flushToDisk(state)
}

function setState(updater: (prev: AppState) => AppState) {
  const next = updater(state)
  if (next === state) return
  state = { ...next, updatedAt: new Date().toISOString() }
  emitChange()
}

export function getState() {
  return state
}

export function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useStore() {
  return useSyncExternalStore(subscribe, getState)
}

export function getPersist() {
  return persistSnap
}

export function usePersist() {
  return useSyncExternalStore(subscribe, getPersist)
}

export function persistLabel(info: PersistInfo) {
  if (info.status === 'saving') return '正在自动保存…'
  if (info.status === 'saved') return '本地数据库已自动保存'
  if (info.status === 'local-only') return '已写入浏览器数据库'
  if (info.status === 'error') return '保存失败，请导出备份'
  return info.hydrated ? '记录已就绪' : '正在加载本地记录…'
}

async function hydrateFromDisk() {
  persistSnap = { ...persistSnap, status: 'idle', hydrated: false }
  notify()
  try {
    const [diskRes, idbRaw] = await Promise.all([
      fetch('/api/db').catch(() => fetch('/api/progress')),
      idbGet<AppState>().catch(() => null),
    ])
    const json = diskRes.ok ? ((await diskRes.json()) as { data: unknown }) : { data: null }
    const merged = pickBetter(
      pickBetter(normalize(state), normalize(json.data)),
      normalize(idbRaw),
    )
    state = merged
    persistLocal()
    persistSnap = {
      status: diskRes.ok ? 'saved' : 'local-only',
      lastSavedAt: state.updatedAt,
      hydrated: true,
    }
    notify()
  } catch {
    persistSnap = {
      status: 'local-only',
      lastSavedAt: state.updatedAt,
      hydrated: true,
    }
    persistLocal()
    notify()
  }
}

export function hydrateStore() {
  if (!hydratePromise) hydratePromise = hydrateFromDisk()
  return hydratePromise
}

hydrateStore()

function flushOnLeave() {
  persistLocal(state)
  const body = JSON.stringify(state)
  const blob = new Blob([body], { type: 'application/json' })
  const sent = navigator.sendBeacon?.('/api/db', blob)
  if (!sent) {
    void fetch('/api/db', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => undefined)
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flushOnLeave)
  window.addEventListener('pagehide', flushOnLeave)
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushOnLeave()
  })
}

function applyStreak(prev: AppState): AppState {
  const t = today()
  if (prev.streak.lastDate === t) return prev
  const yesterday = addDays(t, -1)
  const count = prev.streak.lastDate === yesterday ? prev.streak.count + 1 : 1
  const history = Array.from(new Set([...prev.streak.history, t])).slice(-60)
  return {
    ...prev,
    streak: { lastDate: t, count, history },
  }
}

export function updateProfile(patch: Partial<AppState['profile']>) {
  setState((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } }))
}

export function addStudyMinutes(n: number) {
  setState((prev) => {
    const next = applyStreak(prev)
    return {
      ...next,
      daily: { ...next.daily, date: today(), minutes: next.daily.minutes + n },
    }
  })
}

export function savePaper(
  module: ModuleId,
  paperId: string,
  patch: Partial<PaperProgress>,
) {
  setState((prev) => {
    const next = applyStreak(prev)
    const current = next.progress[module][paperId] ?? { status: 'in_progress' }
    const merged = { ...current, ...patch }
    const justDone =
      patch.status === 'completed' && current.status !== 'completed'
    return {
      ...next,
      progress: {
        ...next.progress,
        [module]: { ...next.progress[module], [paperId]: merged },
      },
      daily: justDone
        ? { ...next.daily, date: today(), papersDone: next.daily.papersDone + 1 }
        : next.daily,
    }
  })
}

export function addMistake(item: Omit<Mistake, 'id' | 'createdAt' | 'mastered'>) {
  setState((prev) => {
    const exists = prev.mistakes.some(
      (m) =>
        !m.mastered &&
        m.module === item.module &&
        m.paperId === item.paperId &&
        m.questionId === item.questionId &&
        m.wordId === item.wordId,
    )
    if (exists) return prev
    return {
      ...prev,
      mistakes: [
        {
          ...item,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          mastered: false,
        },
        ...prev.mistakes,
      ],
    }
  })
}

export function masterMistake(id: string) {
  setState((prev) => ({
    ...prev,
    mistakes: prev.mistakes.map((m) =>
      m.id === id ? { ...m, mastered: true } : m,
    ),
  }))
}

export function restoreMistake(id: string) {
  setState((prev) => ({
    ...prev,
    mistakes: prev.mistakes.map((m) =>
      m.id === id ? { ...m, mastered: false } : m,
    ),
  }))
}

export function reviewWord(wordId: string, knew: boolean) {
  setState((prev) => {
    const next = applyStreak(prev)
    const current: WordProgress = next.words[wordId] ?? {
      status: 'new',
      interval: 0,
      nextReview: today(),
      reviews: 0,
      wrongs: 0,
    }
    let updated: WordProgress
    if (knew) {
      const interval =
        current.interval === 0 ? 1 : Math.min(30, Math.round(current.interval * 2.2))
      updated = {
        status: interval >= 30 ? 'mastered' : 'reviewing',
        interval,
        nextReview: addDays(today(), interval),
        reviews: current.reviews + 1,
        wrongs: current.wrongs,
      }
    } else {
      updated = {
        status: 'learning',
        interval: 0,
        nextReview: today(),
        reviews: current.reviews + 1,
        wrongs: current.wrongs + 1,
      }
    }
    return {
      ...next,
      words: { ...next.words, [wordId]: updated },
      daily: {
        ...next.daily,
        date: today(),
        wordsReviewed: next.daily.wordsReviewed + 1,
      },
    }
  })
}

export function togglePlanTask(date: string, taskId: string) {
  const key = `${date}:${taskId}`
  setState((prev) => {
    const next = applyStreak(prev)
    return {
      ...next,
      planChecks: { ...next.planChecks, [key]: !next.planChecks[key] },
    }
  })
}

export function isWordDue(progress: WordProgress | undefined) {
  if (!progress || progress.status === 'new') return true
  if (progress.status === 'mastered') return false
  return progress.nextReview <= today()
}

export function resetAll() {
  state = { ...defaultState(), updatedAt: new Date().toISOString() }
  emitChange()
}

export function exportBackup() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `六级书房备份-${today()}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export function importBackup(raw: unknown) {
  const next = normalize(raw)
  if (!next) throw new Error('备份文件格式不对')
  state = { ...next, updatedAt: new Date().toISOString() }
  persistSnap = { ...persistSnap, hydrated: true }
  emitChange()
}

