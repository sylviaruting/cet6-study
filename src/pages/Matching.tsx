import { useState } from 'react'
import { MATCHING } from '../data/papers'
import { go } from '../lib/nav'
import { addMistake, savePaper, useStore } from '../store'

const LETTERS = 'ABCDEFGHIJ'.split('')

export function Matching({ paperId }: { paperId: string }) {
  const paper = MATCHING.find((p) => p.id === paperId)
  const state = useStore()
  const saved = paper ? state.progress.matching[paper.id] : undefined
  const [answers, setAnswers] = useState<Record<string, string>>(saved?.answers ?? {})
  const [revealed, setRevealed] = useState(saved?.status === 'completed')

  if (!paper) {
    return (
      <div className="empty">
        找不到这套匹配题。
        <div>
          <button className="btn-ghost" onClick={() => go('#/practice/matching')}>
            返回
          </button>
        </div>
      </div>
    )
  }

  const submit = () => {
    let score = 0
    paper.items.forEach((item) => {
      if (answers[item.id] === item.answer) score += 1
      else {
        addMistake({
          module: 'matching',
          paperId: paper.id,
          questionId: item.id,
          prompt: item.text,
          userAnswer: answers[item.id] ?? '未作答',
          correctAnswer: item.answer,
          explanation: item.explanation,
        })
      }
    })
    setRevealed(true)
    savePaper('matching', paper.id, {
      status: 'completed',
      score,
      total: paper.items.length,
      answers,
      completedAt: new Date().toISOString(),
    })
  }

  return (
    <>
      <div className="topbar">
        <div>
          <p className="kicker">Matching · {paper.year}</p>
          <h1>{paper.title}</h1>
          <p className="muted">{paper.theme}。一段通常只对应一题，先标段意再选。</p>
        </div>
        <button className="btn-ghost" onClick={() => go('#/practice/matching')}>
          返回列表
        </button>
      </div>

      <div className="grid grid-2">
        <article className="card">
          {paper.paragraphs.map((p) => (
            <div className="para" key={p.key}>
              <b>{p.key}</b>
              <div className="passage" style={{ fontSize: 16 }}>
                {p.text}
              </div>
            </div>
          ))}
        </article>
        <div className="grid">
          {paper.items.map((item, i) => {
            const picked = answers[item.id]
            const ok = revealed && picked === item.answer
            const bad = revealed && picked !== item.answer
            return (
              <div className="card" key={item.id}>
                <div className="q-stem">
                  {i + 1}. {item.text}
                </div>
                <select
                  disabled={revealed}
                  value={picked ?? ''}
                  onChange={(e) => {
                    const next = { ...answers, [item.id]: e.target.value }
                    setAnswers(next)
                    savePaper('matching', paper.id, { status: 'in_progress', answers: next })
                  }}
                >
                  <option value="">选择段落</option>
                  {LETTERS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                {revealed && (
                  <div className="explain">
                    {ok ? '正确。' : bad ? `应选 ${item.answer}。` : ''} {item.explanation}
                  </div>
                )}
              </div>
            )
          })}
          {!revealed ? (
            <button className="btn" onClick={submit}>
              交卷并收入错题
            </button>
          ) : (
            <div className="card">
              本次 {saved?.score ?? paper.items.filter((it) => answers[it.id] === it.answer).length}/
              {paper.items.length}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
