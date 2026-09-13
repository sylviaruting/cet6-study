import type { ModuleId, Page, PageName } from '../types'

const PRACTICE_PAGES: PageName[] = [
  'listening',
  'reading',
  'translation',
  'matching',
  'writing',
]

export function parseHash(): Page {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  const parts = raw.split('/').filter(Boolean)
  if (parts.length === 0 || parts[0] === 'home') return { name: 'home' }
  if (parts[0] === 'practice') {
    return { name: 'practice', module: parts[1] as ModuleId | undefined }
  }
  if (parts[0] === 'vocab') return { name: 'vocab' }
  if (parts[0] === 'mistakes') return { name: 'mistakes' }
  if (PRACTICE_PAGES.includes(parts[0] as PageName) && parts[1]) {
    return { name: parts[0] as PageName, paperId: parts[1] }
  }
  return { name: 'home' }
}

export function go(path: string) {
  window.location.hash = path.startsWith('#') ? path : `#${path}`
}

export function daysUntil(date: string) {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date(`${date}T00:00:00`)
  return Math.round((end.getTime() - start.getTime()) / 86400000)
}

export function greeting() {
  const h = new Date().getHours()
  if (h < 5) return '夜深了'
  if (h < 11) return '早上好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
}

export function wordCount(text: string) {
  const parts = text.trim().split(/\s+/).filter(Boolean)
  return text.trim() ? parts.length : 0
}
