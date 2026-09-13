import { useState } from 'react'
import { go } from '../lib/nav'
import { masterMistake, resetAll, restoreMistake, useStore } from '../store'
import type { Mistake } from '../types'

const FILTERS = [
  { id: 'open', label: '待消化' },
  { id: 'all', label: '全部' },
  { id: 'listening', label: '听力' },
  { id: 'reading', label: '阅读' },
  { id: 'matching', label: '匹配' },
  { id: 'translation', label: '翻译' },
  { id: 'writing', label: '作文' },
  { id: 'vocab', label: '单词' },
] as const

const LABELS: Record<Mistake['module'], string> = {
  listening: '听力',
  reading: '阅读',
  matching: '匹配',
  translation: '翻译',
  writing: '作文',
  vocab: '单词',
}

export function Mistakes() {
  const state = useStore()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('open')

  const list = state.mistakes.filter((m) => {
    if (filter === 'open') return !m.mastered
    if (filter === 'all') return true
    return m.module === filter
  })

  return (
    <>
      <div className="topbar">
        <div>
          <p className="kicker">Mistake book</p>
          <h1>错题本</h1>
          <p className="muted">错一次不可怕，可怕的是同样的坑再跳一次。</p>
        </div>
        <button
          className="btn-danger"
          onClick={() => {
            if (confirm('清空本地全部学习记录？此操作不可恢复。')) resetAll()
          }}
        >
          重置全部进度
        </button>
      </div>

      <div className="btn-row" style={{ marginBottom: 16 }}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`chip ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="card empty">这一栏还很干净。去做一套题，错题会自动进来。</div>
      ) : (
        <div className="grid">
          {list.map((m) => (
            <article className="card" key={m.id}>
              <div className="paper-row">
                <span className={m.mastered ? 'tag done' : 'tag warn'}>{LABELS[m.module]}</span>
                <span className="muted">{new Date(m.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 style={{ margin: '10px 0' }}>{m.prompt}</h3>
              <p>
                <strong>你的作答：</strong>
                {m.userAnswer}
              </p>
              <p>
                <strong>参考：</strong>
                {m.correctAnswer}
              </p>
              {m.explanation && <div className="explain">{m.explanation}</div>}
              <div className="btn-row" style={{ marginTop: 12 }}>
                {m.mastered ? (
                  <button className="btn-ghost" onClick={() => restoreMistake(m.id)}>
                    重新打开
                  </button>
                ) : (
                  <button className="btn" onClick={() => masterMistake(m.id)}>
                    标为已掌握
                  </button>
                )}
                {m.paperId && m.module !== 'vocab' && (
                  <button className="btn-ghost" onClick={() => go(`#/${m.module}/${m.paperId}`)}>
                    回到原题
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
