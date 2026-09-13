import { useEffect, useState } from 'react'
import { WRITING } from '../data/papers'
import { go, wordCount } from '../lib/nav'
import { addMistake, savePaper, useStore } from '../store'

export function Writing({ paperId }: { paperId: string }) {
  const paper = WRITING.find((p) => p.id === paperId)
  const state = useStore()
  const saved = paper ? state.progress.writing[paper.id] : undefined
  const [text, setText] = useState(saved?.text ?? '')
  const [showOutline, setShowOutline] = useState(false)
  const [revealed, setRevealed] = useState(saved?.status === 'completed')
  const [selfScore, setSelfScore] = useState(saved?.selfScore ?? 9)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (revealed) return
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(t)
  }, [revealed])

  if (!paper) {
    return (
      <div className="empty">
        找不到这套作文。
        <div>
          <button className="btn-ghost" onClick={() => go('#/practice/writing')}>
            返回
          </button>
        </div>
      </div>
    )
  }

  const words = wordCount(text)
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  const submit = () => {
    setRevealed(true)
    savePaper('writing', paper.id, {
      status: 'completed',
      text,
      selfScore,
      score: selfScore,
      total: 15,
      completedAt: new Date().toISOString(),
    })
  }

  return (
    <>
      <div className="topbar">
        <div>
          <p className="kicker">Writing · {paper.year}</p>
          <h1>{paper.title}</h1>
          <p className="muted">考试建议 30 分钟，150–200 词。先列提纲再写。</p>
        </div>
        <div className="btn-row">
          <span className="tag">
            {mm}:{ss} · {words} words
          </span>
          <button className="btn-ghost" onClick={() => go('#/practice/writing')}>
            返回列表
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <p className="kicker">Prompt</p>
        <div className="passage" style={{ fontSize: 18 }}>
          {paper.prompt}
        </div>
        <div className="btn-row" style={{ marginTop: 12 }}>
          <button className="btn-ghost" onClick={() => setShowOutline((v) => !v)}>
            {showOutline ? '收起提纲' : '查看提纲提示'}
          </button>
        </div>
        {showOutline && (
          <ol>
            {paper.outline.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        )}
      </div>

      <div className="card">
        <textarea
          style={{ minHeight: 280 }}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            savePaper('writing', paper.id, { status: 'in_progress', text: e.target.value })
          }}
          placeholder="在这里写完整篇作文"
        />
        <div className="btn-row" style={{ marginTop: 12 }}>
          <span className={words >= 150 && words <= 200 ? 'tag done' : 'tag warn'}>
            {words < 150 ? `还差 ${150 - words} 词` : words > 200 ? `超出 ${words - 200} 词` : '词数合适'}
          </span>
          {!revealed && (
            <button className="btn" onClick={submit}>
              对照范文
            </button>
          )}
        </div>
      </div>

      {revealed && (
        <div className="grid" style={{ marginTop: 16 }}>
          <div className="card">
            <h2>评分提醒</h2>
            {paper.rubric.map((r) => (
              <p key={r.name}>
                <strong>{r.name}：</strong>
                {r.desc}
              </p>
            ))}
            <label>
              自评（满分 15）
              <input
                type="number"
                min={0}
                max={15}
                value={selfScore}
                onChange={(e) => {
                  const n = Number(e.target.value)
                  setSelfScore(n)
                  savePaper('writing', paper.id, {
                    status: 'completed',
                    text,
                    selfScore: n,
                    score: n,
                    total: 15,
                  })
                }}
                style={{ maxWidth: 120, marginTop: 8 }}
              />
            </label>
            <div className="btn-row" style={{ marginTop: 12 }}>
              <button
                className="btn-ghost"
                onClick={() =>
                  addMistake({
                    module: 'writing',
                    paperId: paper.id,
                    questionId: paper.id,
                    prompt: paper.prompt,
                    userAnswer: text || '未作答',
                    correctAnswer: paper.sample,
                    explanation: paper.rubric.map((r) => r.desc).join(' '),
                  })
                }
              >
                收入错题本
              </button>
            </div>
          </div>
          <div className="card">
            <p className="kicker">Sample</p>
            <div className="passage" style={{ fontSize: 17, whiteSpace: 'pre-wrap' }}>
              {paper.sample}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
