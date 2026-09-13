import { useState } from 'react'
import { TRANSLATION } from '../data/papers'
import { go, wordCount } from '../lib/nav'
import { addMistake, savePaper, useStore } from '../store'

export function Translation({ paperId }: { paperId: string }) {
  const paper = TRANSLATION.find((p) => p.id === paperId)
  const state = useStore()
  const saved = paper ? state.progress.translation[paper.id] : undefined
  const [text, setText] = useState(saved?.text ?? '')
  const [revealed, setRevealed] = useState(saved?.status === 'completed')
  const [selfScore, setSelfScore] = useState(saved?.selfScore ?? 10)
  const [checks, setChecks] = useState<Record<number, boolean>>({})

  if (!paper) {
    return (
      <div className="empty">
        找不到这套翻译。
        <div>
          <button className="btn-ghost" onClick={() => go('#/practice/translation')}>
            返回
          </button>
        </div>
      </div>
    )
  }

  const submit = () => {
    setRevealed(true)
    savePaper('translation', paper.id, {
      status: 'completed',
      text,
      selfScore,
      score: selfScore,
      total: 15,
      completedAt: new Date().toISOString(),
    })
  }

  const saveAsMistake = () => {
    addMistake({
      module: 'translation',
      paperId: paper.id,
      questionId: paper.id,
      prompt: paper.source.slice(0, 80) + '…',
      userAnswer: text || '未作答',
      correctAnswer: paper.reference,
      explanation: paper.notes,
    })
  }

  return (
    <>
      <div className="topbar">
        <div>
          <p className="kicker">Translation · {paper.year}</p>
          <h1>{paper.title}</h1>
          <p className="muted">先译完整段，再对照采分点，不要边看范文边写。</p>
        </div>
        <button className="btn-ghost" onClick={() => go('#/practice/translation')}>
          返回列表
        </button>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <p className="kicker">汉语原文</p>
          <div className="cn-source">{paper.source}</div>
        </div>
        <div className="card">
          <div className="paper-row" style={{ marginBottom: 8 }}>
            <p className="kicker">你的译文</p>
            <span className="stat-label">{wordCount(text)} words</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              savePaper('translation', paper.id, { status: 'in_progress', text: e.target.value })
            }}
            placeholder="把整段译成自然的书面英语"
          />
          {!revealed && (
            <div className="btn-row" style={{ marginTop: 12 }}>
              <button className="btn" onClick={submit}>
                对照范文
              </button>
            </div>
          )}
        </div>
      </div>

      {revealed && (
        <div className="grid" style={{ marginTop: 16 }}>
          <div className="card">
            <h2 style={{ marginBottom: 10 }}>采分点自检</h2>
            {paper.keypoints.map((point, i) => (
              <label key={point} style={{ display: 'block', margin: '8px 0' }}>
                <input
                  type="checkbox"
                  checked={!!checks[i]}
                  onChange={(e) => setChecks((prev) => ({ ...prev, [i]: e.target.checked }))}
                />{' '}
                {point}
              </label>
            ))}
          </div>
          <div className="card">
            <p className="kicker">Reference</p>
            <div className="passage" style={{ fontSize: 17 }}>
              {paper.reference}
            </div>
            <div className="explain">{paper.notes}</div>
          </div>
          <div className="card">
            <h3>自评（满分 15）</h3>
            <input
              type="number"
              min={0}
              max={15}
              value={selfScore}
              onChange={(e) => {
                const n = Number(e.target.value)
                setSelfScore(n)
                savePaper('translation', paper.id, {
                  status: 'completed',
                  text,
                  selfScore: n,
                  score: n,
                  total: 15,
                })
              }}
              style={{ maxWidth: 120, margin: '10px 0' }}
            />
            <div className="btn-row">
              <button className="btn-ghost" onClick={saveAsMistake}>
                收入错题本
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
