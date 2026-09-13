export type PhaseId = 'p1' | 'p2' | 'p3' | 'final' | 'exam'

export interface PlanTask {
  id: string
  label: string
  href?: string
}

export interface PlanDay {
  date: string
  weekday: string
  phase: PhaseId
  phaseTitle: string
  weekLabel: string
  focus: string
  tasks: PlanTask[]
}

export const PHASES: {
  id: PhaseId
  title: string
  range: string
  goal: string
}[] = [
  {
    id: 'p1',
    title: '第一阶段 · 基础强化',
    range: '9.13—10.11',
    goal: '先别追分数。过完相当一部分核心词；仔细阅读正确率 ≥ 60%；听力能抓住关键词和转折。',
  },
  {
    id: 'p2',
    title: '第二阶段 · 真题强化',
    range: '10.12—11.15',
    goal: '最重要的 5 周。按周一到周日固定循环，周六整套计时，周日复盘。',
  },
  {
    id: 'p3',
    title: '第三阶段 · 冲刺',
    range: '11.16—12.5',
    goal: '每周三、周六各一套完整真题。听力 60%–65%，仔细阅读 ≥ 70%，段落匹配 ≥ 70%。准备 30–50 个自己的作文表达。',
  },
  {
    id: 'final',
    title: '最后一周',
    range: '12.6—12.11',
    goal: '停止大量刷新题。两次完整模拟，其余时间复习错题、听力和单词。',
  },
  {
    id: 'exam',
    title: '考试日',
    range: '12.12',
    goal: '正常作息，带齐证件，晚上不必再刷题。',
  },
]

const WEEKDAY = ['日', '一', '二', '三', '四', '五', '六']

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function fmt(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function parse(date: string) {
  return new Date(`${date}T00:00:00`)
}

function addDays(date: string, days: number) {
  const d = parse(date)
  d.setDate(d.getDate() + days)
  return fmt(d)
}

function eachDay(start: string, end: string) {
  const out: string[] = []
  let cur = start
  while (cur <= end) {
    out.push(cur)
    cur = addDays(cur, 1)
  }
  return out
}

function wd(date: string) {
  return WEEKDAY[parse(date).getDay()]
}

function dow(date: string) {
  return parse(date).getDay()
}

const T = {
  words60: { id: 'words60', label: '60 个新词', href: '#/vocab' },
  wordsReview: { id: 'words-review', label: '复习本周单词', href: '#/vocab' },
  listen: { id: 'listen', label: '六级真题听力', href: '#/practice/listening' },
  listenLoop: {
    id: 'listen-loop',
    label: '听力：做题→对答案→看原文→重听',
    href: '#/practice/listening',
  },
  read1: { id: 'read1', label: '仔细阅读 1 篇', href: '#/practice/reading' },
  read2: { id: 'read2', label: '仔细阅读 2 篇', href: '#/practice/reading' },
  match: { id: 'match', label: '段落匹配', href: '#/practice/matching' },
  trans: { id: 'trans', label: '翻译 1 道', href: '#/practice/translation' },
  write: { id: 'write', label: '作文练习', href: '#/practice/writing' },
  mock: { id: 'mock', label: '完整计时一套真题', href: '#/practice' },
  reviewMock: { id: 'review-mock', label: '复盘整套真题', href: '#/mistakes' },
  mistakes: { id: 'mistakes', label: '复习错题', href: '#/mistakes' },
  listenKey: { id: 'listen-key', label: '听力抓关键词 / 转折', href: '#/practice/listening' },
  expr: { id: 'expr', label: '整理作文万能表达', href: '#/practice/writing' },
  recordL: { id: 'record-l', label: '记录听力正确率' },
  recordR: { id: 'record-r', label: '记录阅读正确率' },
  recordW: { id: 'record-w', label: '记下作文问题' },
  recordT: { id: 'record-t', label: '记下翻译问题' },
  rest: { id: 'rest', label: '晚上正常休息，不再刷题' },
  exam: { id: 'exam', label: '考试：带齐证件，按时出发' },
}

function p1Tasks(date: string): { weekLabel: string; focus: string; tasks: PlanTask[] } {
  if (date <= '2026-09-20') {
    return {
      weekLabel: '第 1 周',
      focus: date === '2026-09-13'
        ? '今天开始适应六级难度，先不用特别在意正确率。'
        : '适应六级难度，先不用特别在意正确率。',
      tasks: [T.words60, T.listen, T.read1],
    }
  }
  if (date <= '2026-09-27') {
    return {
      weekLabel: '第 2 周',
      focus: '听力严格执行四步；阅读加到每天 2 篇。',
      tasks: [T.words60, T.listenLoop, T.read2],
    }
  }
  if (date <= '2026-10-04') {
    const tasks: PlanTask[] = [T.words60, T.listenLoop, T.read2]
    if (['2026-09-29', '2026-10-01', '2026-10-03'].includes(date)) tasks.push(T.match)
    if (['2026-09-28', '2026-09-30', '2026-10-02', '2026-10-04'].includes(date)) tasks.push(T.trans)
    return {
      weekLabel: '第 3 周',
      focus: '加入段落匹配（本周 3 次），翻译隔天一题。',
      tasks,
    }
  }
  const tasks: PlanTask[] = [T.words60, T.listenLoop, T.read2]
  if (date === '2026-10-10') tasks.push(T.mock)
  if (date === '2026-10-11') tasks.push(T.reviewMock)
  return {
    weekLabel: '第 4 周',
    focus: '10.10 第一次完整计时套题，成绩只作基准，不因分低改计划。',
    tasks,
  }
}

function p2Tasks(date: string): { weekLabel: string; focus: string; tasks: PlanTask[] } {
  const start = parse('2026-10-12')
  const week = Math.floor((parse(date).getTime() - start.getTime()) / 86400000 / 7) + 1
  const map: Record<number, PlanTask[]> = {
    1: [T.listen, T.read2],
    2: [T.listen, T.match, T.trans],
    3: [T.listen, T.read2],
    4: [T.listen, T.read2, T.write],
    5: [T.listen, T.match],
    6: [T.mock],
    0: [T.reviewMock, T.wordsReview],
  }
  return {
    weekLabel: `强化第 ${week} 周`,
    focus: '周一到周五分项练，周六整套计时，周日复盘。',
    tasks: map[dow(date)],
  }
}

function p3Tasks(date: string): { weekLabel: string; focus: string; tasks: PlanTask[] } {
  const start = parse('2026-11-16')
  const week = Math.floor((parse(date).getTime() - start.getTime()) / 86400000 / 7) + 1
  const map: Record<number, PlanTask[]> = {
    1: [T.mistakes, T.words60, T.expr],
    2: [T.listenLoop, T.wordsReview],
    3: [T.mock, T.recordL, T.recordR, T.recordW, T.recordT],
    4: [T.mistakes, T.expr],
    5: [T.listen, T.match],
    6: [T.mock, T.recordL, T.recordR, T.recordW, T.recordT],
    0: [T.reviewMock, T.wordsReview],
  }
  return {
    weekLabel: `冲刺第 ${week} 周`,
    focus: '周三、周六各一套完整真题，并记下听力 / 阅读正确率和作文、翻译问题。',
    tasks: map[dow(date)],
  }
}

function finalTasks(date: string): { weekLabel: string; focus: string; tasks: PlanTask[] } {
  if (date === '2026-12-06') {
    return { weekLabel: '考前一周', focus: '完整模拟一次。', tasks: [T.mock, T.recordL, T.recordR] }
  }
  if (date <= '2026-12-09') {
    return {
      weekLabel: '考前一周',
      focus: '复习错题 + 听力 + 单词，不再大量刷新题。',
      tasks: [T.mistakes, T.listenKey, T.wordsReview],
    }
  }
  if (date === '2026-12-10') {
    return { weekLabel: '考前一周', focus: '最后一次完整模拟。', tasks: [T.mock, T.recordL, T.recordR] }
  }
  return {
    weekLabel: '考前一周',
    focus: '只复习高频词、作文表达和旧错题，晚上正常休息。',
    tasks: [T.wordsReview, T.expr, T.mistakes, T.rest],
  }
}

function makeDay(
  date: string,
  phase: PhaseId,
  extra: { weekLabel: string; focus: string; tasks: PlanTask[] },
): PlanDay {
  return {
    date,
    weekday: wd(date),
    phase,
    phaseTitle: PHASES.find((p) => p.id === phase)!.title,
    ...extra,
  }
}

function buildPlan(): PlanDay[] {
  const days: PlanDay[] = []
  for (const date of eachDay('2026-09-13', '2026-10-11')) {
    days.push(makeDay(date, 'p1', p1Tasks(date)))
  }
  for (const date of eachDay('2026-10-12', '2026-11-15')) {
    days.push(makeDay(date, 'p2', p2Tasks(date)))
  }
  for (const date of eachDay('2026-11-16', '2026-12-05')) {
    days.push(makeDay(date, 'p3', p3Tasks(date)))
  }
  for (const date of eachDay('2026-12-06', '2026-12-11')) {
    days.push(makeDay(date, 'final', finalTasks(date)))
  }
  days.push(
    makeDay('2026-12-12', 'exam', {
      weekLabel: '考试日',
      focus: '正常作息，不必再刷题。',
      tasks: [T.exam, T.rest],
    }),
  )
  return days
}

export const PLAN_DAYS = buildPlan()

export function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function findToday() {
  return PLAN_DAYS.find((d) => d.date === todayKey())
}

export function planKey(date: string, taskId: string) {
  return `${date}:${taskId}`
}

export function shortDate(date: string) {
  const [, m, d] = date.split('-')
  return `${Number(m)}.${Number(d)}`
}

export function dayDone(day: PlanDay, checks: Record<string, boolean>) {
  return day.tasks.length > 0 && day.tasks.every((t) => checks[planKey(day.date, t.id)])
}

export function dayScore(day: PlanDay, checks: Record<string, boolean>) {
  const done = day.tasks.filter((t) => checks[planKey(day.date, t.id)]).length
  return { done, total: day.tasks.length }
}
