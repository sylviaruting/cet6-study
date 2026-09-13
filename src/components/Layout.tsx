import { useEffect, type ReactNode } from 'react'
import type { Page } from '../types'
import { addStudyMinutes, persistLabel, usePersist, useStore } from '../store'
import { go } from '../lib/nav'

const LINKS: { path: string; label: string; page: Page['name'] }[] = [
  { path: '#/home', label: '书房首页', page: 'home' },
  { path: '#/practice', label: '真题精做', page: 'practice' },
  { path: '#/vocab', label: '单词背诵', page: 'vocab' },
  { path: '#/mistakes', label: '错题本', page: 'mistakes' },
]

export function Layout({ page, children }: { page: Page; children: ReactNode }) {
  const state = useStore()
  const persist = usePersist()
  const openMistakes = state.mistakes.filter((m) => !m.mastered).length

  useEffect(() => {
    const timer = window.setInterval(() => addStudyMinutes(1), 60000)
    return () => window.clearInterval(timer)
  }, [])

  const active =
    page.name === 'home'
      ? 'home'
      : page.name === 'vocab'
        ? 'vocab'
        : page.name === 'mistakes'
          ? 'mistakes'
          : 'practice'

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">六级书房</div>
          <div className="brand-sub">CET-6 · 710</div>
        </div>
        <nav className="nav">
          {LINKS.map((link) => (
            <button
              key={link.path}
              className={active === link.page ? 'active' : ''}
              onClick={() => go(link.path)}
            >
              {link.label}
              {link.page === 'mistakes' && openMistakes > 0 ? ` · ${openMistakes}` : ''}
            </button>
          ))}
        </nav>
        <div className="side-foot">
          连续学习
          <strong>{state.streak.count} 天</strong>
          今日已学 {state.daily.minutes} 分钟
          <div className="save-line">{persistLabel(persist)}</div>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  )
}
