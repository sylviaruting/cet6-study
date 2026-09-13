import { useEffect, useState } from 'react'
import { Quiz } from '../components/Quiz'
import { READING } from '../data/papers'
import { go } from '../lib/nav'
import { addMistake, savePaper, useStore } from '../store'

export function Reading({ paperId }: { paperId: string }) {
  const paper = READING.find((p) => p.id === paperId)
  const state = useStore()
  const saved = paper ? state.progress.reading[paper.id] : undefined
  const [answers, setAnswers] = useState<Record<string, string>>(saved?.answers ?? {})
  const [revealed, setRevealed] = useState(saved?.status === 'completed')
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (revealed) return
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(t)
  }, [revealed])

  if (!paper) {
    return (
      <div className="empty">
        找不到这套阅读。
        <div>
          <button className="btn-ghost" onClick={() => go('#/practice/reading')}>
            返回
          </button>
        </div>
      </div>
    )
  }

  const submit = () => {
    let score = 0
    paper.questions.forEach((q) => {
      if (answers[q.id] === q.answer) score += 1
      else {
        addMistake({
          module: 'reading',
          paperId: paper.id,
          questionId: q.id,
          prompt: q.stem,
          userAnswer: answers[q.id] ?? '未作答',
          correctAnswer: q.answer,
          explanation: q.explanation,
        })
      }
    })
    setRevealed(true)
    savePaper('reading', paper.id, {
      status: 'completed',
      score,
      total: paper.questions.length,
      answers,
      completedAt: new Date().toISOString(),
    })
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <>
      <div className="topbar">
        <div>
          <p className="kicker">Reading · {paper.year}</p>
          <h1>{paper.title}</h1>
          <p className="muted">建议 {paper.minutes} 分钟。先读完全文，再回头定位。</p>
        </div>
        <div className="btn-row">
          <span className="tag">用时 {mm}:{ss}</span>
          <button className="btn-ghost" onClick={() => go('#/practice/reading')}>
            返回列表
          </button>
        </div>
      </div>

      <div className="grid grid-2">
        <article className="card">
          <p className="kicker">Passage</p>
          <h2 style={{ marginBottom: 16 }}>{paper.passageTitle}</h2>
          <div className="passage">
            {paper.passage.split('\n\n').map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>
        </article>
        <div className="grid">
          <Quiz
            questions={paper.questions}
            answers={answers}
            revealed={revealed}
            onPick={(id, key) => {
              const next = { ...answers, [id]: key }
              setAnswers(next)
              savePaper('reading', paper.id, { status: 'in_progress', answers: next })
            }}
          />
          {!revealed ? (
            <button className="btn" onClick={submit}>
              交卷并收入错题
            </button>
          ) : (
            <div className="card">
              本次 {saved?.score ?? paper.questions.filter((q) => answers[q.id] === q.answer).length}/
              {paper.questions.length}。请把解释对着原文再读一遍。
            </div>
          )}
        </div>
      </div>
    </>
  )
}
