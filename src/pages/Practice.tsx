import { LISTENING, MATCHING, MODULES, READING, TRANSLATION, WRITING } from '../data/papers'
import { go } from '../lib/nav'
import { useStore } from '../store'
import type { ModuleId, PaperProgress } from '../types'

const PAPERS: Record<ModuleId, { id: string; title: string; year: string }[]> = {
  listening: LISTENING,
  reading: READING,
  matching: MATCHING,
  translation: TRANSLATION,
  writing: WRITING,
}

function statusOf(p?: PaperProgress) {
  if (!p || p.status === 'not_started') return { label: '未开始', cls: 'tag' }
  if (p.status === 'in_progress') return { label: '做到一半', cls: 'tag warn' }
  const score = p.score != null && p.total ? `${p.score}/${p.total}` : '已完成'
  return { label: score, cls: 'tag done' }
}

export function Practice({ module }: { module?: ModuleId }) {
  const state = useStore()
  const current = module && PAPERS[module] ? module : undefined

  return (
    <>
      <div className="topbar">
        <div>
          <p className="kicker">Intensive papers</p>
          <h1>真题精做</h1>
          <p className="muted">按板块拆开练。先求懂，再求快。</p>
        </div>
      </div>

      <div className="btn-row" style={{ marginBottom: 20 }}>
        <button className={`chip ${!current ? 'active' : ''}`} onClick={() => go('#/practice')}>
          全部
        </button>
        {MODULES.map((m) => (
          <button
            key={m.id}
            className={`chip ${current === m.id ? 'active' : ''}`}
            onClick={() => go(`#/practice/${m.id}`)}
          >
            {m.title}
          </button>
        ))}
      </div>

      {(current ? MODULES.filter((m) => m.id === current) : MODULES).map((m) => (
        <section key={m.id} style={{ marginBottom: 22 }}>
          <p className="kicker">{m.en}</p>
          <h2 style={{ marginBottom: 12 }}>{m.title}</h2>
          <div className="grid">
            {PAPERS[m.id].map((paper) => {
              const st = statusOf(state.progress[m.id][paper.id])
              return (
                <div className="card paper-row" key={paper.id}>
                  <div>
                    <div className="muted" style={{ fontSize: 13 }}>
                      {paper.year}
                    </div>
                    <h3>{paper.title}</h3>
                  </div>
                  <div className="btn-row">
                    <span className={st.cls}>{st.label}</span>
                    <button className="btn" onClick={() => go(`#/${m.id}/${paper.id}`)}>
                      进入
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </>
  )
}
