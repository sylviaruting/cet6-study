import { LISTENING, MATCHING, MODULES, READING, TRANSLATION, WRITING } from '../data/papers'
import { WORDS } from '../data/words'
import { greeting, daysUntil, go } from '../lib/nav'
import {
  exportBackup,
  importBackup,
  isWordDue,
  persistLabel,
  updateProfile,
  usePersist,
  useStore,
} from '../store'
import { PlanBoard } from '../components/PlanBoard'
import type { ModuleId } from '../types'

const COUNTS: Record<ModuleId, number> = {
  listening: LISTENING.length,
  reading: READING.length,
  matching: MATCHING.length,
  translation: TRANSLATION.length,
  writing: WRITING.length,
}

export function Home() {
  const state = useStore()
  const persist = usePersist()
  const days = daysUntil(state.profile.examDate)
  const dueWords = WORDS.filter((w) => isWordDue(state.words[w.id])).length
  const openMistakes = state.mistakes.filter((m) => !m.mastered).length
  const masteredWords = Object.values(state.words).filter((w) => w.status === 'mastered').length

  const moduleDone = (id: ModuleId) =>
    Object.values(state.progress[id]).filter((p) => p.status === 'completed').length

  const weakest = MODULES.slice()
    .sort((a, b) => moduleDone(a.id) / COUNTS[a.id] - moduleDone(b.id) / COUNTS[b.id])[0]

  return (
    <>
      <div className="topbar">
        <div>
          <p className="kicker">Private study room</p>
          <h1>
            {greeting()}，{state.profile.name}
          </h1>
          <p className="muted">把六级当成一项可以完成的手艺，而不是一场突然降临的考试。</p>
        </div>
        <div className="card" style={{ minWidth: 180 }}>
          <div className="stat-label">距考试</div>
          <div className="stat-num">{days}</div>
          <div className="stat-label">天 · 目标 {state.profile.targetScore}</div>
        </div>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="stat-label">连续打卡</div>
          <div className="stat-num">{state.streak.count}</div>
          <div className="stat-label">天</div>
        </div>
        <div className="card">
          <div className="stat-label">今日单词</div>
          <div className="stat-num">{state.daily.wordsReviewed}</div>
          <div className="stat-label">/ 20 个建议量</div>
        </div>
        <div className="card">
          <div className="stat-label">今日完成套题</div>
          <div className="stat-num">{state.daily.papersDone}</div>
          <div className="stat-label">累计错题 {openMistakes} 道未消化</div>
        </div>
        <div className="card">
          <div className="stat-label">已掌握单词</div>
          <div className="stat-num">{masteredWords}</div>
          <div className="stat-label">词库 {WORDS.length} 个高频词</div>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <PlanBoard />
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <p className="kicker">今日建议</p>
        <h2 style={{ marginBottom: 8 }}>先做最弱的一块</h2>
        <p className="muted" style={{ marginBottom: 14 }}>
          {dueWords > 0
            ? `有 ${dueWords} 个单词到期，建议先用 10 分钟过一遍卡片。`
            : openMistakes > 0
              ? `错题本里还有 ${openMistakes} 道，复做比继续刷新题更值钱。`
              : `「${weakest.title}」完成度最低，今天可以精做一题。`}
        </p>
        <div className="btn-row">
          <button className="btn" onClick={() => go('#/vocab')}>
            去背单词
          </button>
          <button className="btn-ghost" onClick={() => go(`#/practice/${weakest.id}`)}>
            做{weakest.title}
          </button>
          <button className="btn-ghost" onClick={() => go('#/mistakes')}>
            看错题
          </button>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 20 }}>
        {MODULES.map((m) => {
          const done = moduleDone(m.id)
          const total = COUNTS[m.id]
          const pct = Math.round((done / total) * 100)
          return (
            <button
              key={m.id}
              className="card module-card"
              onClick={() => go(`#/practice/${m.id}`)}
            >
              <div className="module-en">{m.en}</div>
              <h2>{m.title}</h2>
              <p className="muted" style={{ margin: 0 }}>
                {m.desc}
              </p>
              <div className="bar">
                <i style={{ width: `${pct}%` }} />
              </div>
              <div className="stat-label">
                {done}/{total} 套已完成
              </div>
            </button>
          )
        })}
      </div>

      <div className="card">
        <p className="kicker">个人设定</p>
        <h2 style={{ marginBottom: 12 }}>考试日与目标分</h2>
        <div className="settings">
          <input
            type="text"
            value={state.profile.name}
            onChange={(e) => updateProfile({ name: e.target.value })}
            placeholder="称呼"
          />
          <input
            type="number"
            min={425}
            max={710}
            value={state.profile.targetScore}
            onChange={(e) => updateProfile({ targetScore: Number(e.target.value) || 425 })}
          />
          <input
            type="date"
            value={state.profile.examDate}
            onChange={(e) => updateProfile({ examDate: e.target.value })}
          />
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <p className="kicker">本地数据库</p>
        <h2 style={{ marginBottom: 8 }}>每次操作自动保存</h2>
        <p className="muted" style={{ marginBottom: 12 }}>
          {persistLabel(persist)}
          {persist.lastSavedAt
            ? ` · ${new Date(persist.lastSavedAt).toLocaleString('zh-CN', { hour12: false })}`
            : ''}
          。打开网页会自动加载本地记录；做题、背词时持续写入；关掉页面也会再自动保存到 <code>data/cet6.db</code>。
        </p>
        <div className="btn-row">
          <button className="btn" onClick={exportBackup}>
            导出备份
          </button>
          <label className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center' }}>
            导入备份
            <input
              type="file"
              accept="application/json,.json"
              hidden
              onChange={async (e) => {
                const file = e.target.files?.[0]
                e.target.value = ''
                if (!file) return
                try {
                  const raw = JSON.parse(await file.text())
                  if (!confirm('导入会覆盖当前学习记录，确定吗？')) return
                  importBackup(raw)
                } catch {
                  alert('这个备份文件无法读取。')
                }
              }}
            />
          </label>
        </div>
      </div>
    </>
  )
}
