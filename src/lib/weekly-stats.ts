import { MODULES } from '../data/papers'
import { PLAN_DAYS, dayDone, dayScore, findToday, planKey } from '../data/plan'
import { WORDS } from '../data/words'
import type { AppState } from '../types'

export interface WeeklySnapshot {
  name: string
  targetScore: number
  examDate: string
  daysToExam: number
  weekStart: string
  weekEnd: string
  phaseTitle: string
  phaseGoal: string
  planned: number
  checked: number
  daysFull: number
  daysInWeek: number
  missed: string[]
  streak: number
  wordsMastered: number
  wordsTouched: number
  wordBank: number
  papers: { module: string; paperId: string; status: string; score?: string }[]
  mistakesByModule: { module: string; open: number }[]
  openMistakes: number
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function fmt(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function addDays(date: string, days: number) {
  const d = new Date(`${date}T00:00:00`)
  d.setDate(d.getDate() + days)
  return fmt(d)
}

export function mondayOf(date = new Date()) {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const day = copy.getDay()
  const diff = day === 0 ? -6 : 1 - day
  copy.setDate(copy.getDate() + diff)
  return fmt(copy)
}

export function weekRange(now = new Date()) {
  const start = mondayOf(now)
  return { weekStart: start, weekEnd: addDays(start, 6) }
}

export function weeklyReportDue(lastSent: string) {
  if (!lastSent) return new Date().getDay() === 0
  return mondayOf(new Date(lastSent)) < mondayOf(new Date())
}

export function buildWeeklySnapshot(state: AppState): WeeklySnapshot {
  const { weekStart, weekEnd } = weekRange()
  const today = findToday()
  const weekDays = PLAN_DAYS.filter((d) => d.date >= weekStart && d.date <= weekEnd)
  let planned = 0
  let checked = 0
  const missed: string[] = []
  weekDays.forEach((day) => {
    const score = dayScore(day, state.planChecks)
    planned += score.total
    checked += score.done
    day.tasks.forEach((task) => {
      if (!state.planChecks[planKey(day.date, task.id)]) {
        missed.push(`${day.date} 周${day.weekday} · ${task.label}`)
      }
    })
  })

  const papers = MODULES.flatMap((m) =>
    Object.entries(state.progress[m.id] ?? {}).map(([paperId, p]) => ({
      module: m.title,
      paperId,
      status: p.status,
      score: p.score != null && p.total != null ? `${p.score}/${p.total}` : undefined,
    })),
  )

  const labels: Record<string, string> = {
    listening: '听力',
    reading: '阅读',
    matching: '匹配',
    translation: '翻译',
    writing: '作文',
    vocab: '单词',
  }
  const mistakesByModule = Object.entries(
    state.mistakes
      .filter((m) => !m.mastered)
      .reduce<Record<string, number>>((acc, m) => {
        acc[m.module] = (acc[m.module] ?? 0) + 1
        return acc
      }, {}),
  ).map(([module, open]) => ({ module: labels[module] ?? module, open }))

  const exam = new Date(`${state.profile.examDate}T00:00:00`)
  const start = new Date()
  start.setHours(0, 0, 0, 0)

  return {
    name: state.profile.name,
    targetScore: state.profile.targetScore,
    examDate: state.profile.examDate,
    daysToExam: Math.round((exam.getTime() - start.getTime()) / 86400000),
    weekStart,
    weekEnd,
    phaseTitle: today?.phaseTitle ?? '计划外',
    phaseGoal: today?.focus ?? '',
    planned,
    checked,
    daysFull: weekDays.filter((d) => dayDone(d, state.planChecks)).length,
    daysInWeek: weekDays.length,
    missed: missed.slice(0, 12),
    streak: state.streak.count,
    wordsMastered: Object.values(state.words).filter((w) => w.status === 'mastered').length,
    wordsTouched: Object.keys(state.words).length,
    wordBank: WORDS.length,
    papers,
    mistakesByModule,
    openMistakes: state.mistakes.filter((m) => !m.mastered).length,
  }
}
