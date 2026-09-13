import { useMemo, useState } from 'react'
import { LISTENING } from '../data/papers'
import { Quiz } from '../components/Quiz'
import { go } from '../lib/nav'
import { normalizeAnswer, speakEnglish, stopSpeak } from '../lib/tts'
import { addMistake, savePaper, useStore } from '../store'

export function Listening({ paperId }: { paperId: string }) {
  const paper = LISTENING.find((p) => p.id === paperId)
  const state = useStore()
  const saved = paper ? state.progress.listening[paper.id] : undefined
  const [tab, setTab] = useState<'listen' | 'dictation' | 'quiz'>('listen')
  const [rate, setRate] = useState(0.95)
  const [hide, setHide] = useState(true)
  const [dictation, setDictation] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>(saved?.answers ?? {})
  const [revealed, setRevealed] = useState(saved?.status === 'completed')

  const fullText = useMemo(
    () => (paper ? paper.script.map((s) => s.text).join(' ') : ''),
    [paper],
  )

  if (!paper) {
    return (
      <div className="empty">
        找不到这套听力。
        <div>
          <button className="btn-ghost" onClick={() => go('#/practice/listening')}>
            返回
          </button>
        </div>
      </div>
    )
  }

  const submit = () => {
    let score = 0
    paper.questions.forEach((q) => {
      const ok = answers[q.id] === q.answer
      if (ok) score += 1
      else {
        addMistake({
          module: 'listening',
          paperId: paper.id,
          questionId: q.id,
          prompt: q.stem,
          userAnswer: answers[q.id] ?? '未作答',
          correctAnswer: `${q.answer}. ${q.options.find((o) => o.key === q.answer)?.text}`,
          explanation: q.explanation,
        })
      }
    })
    setRevealed(true)
    savePaper('listening', paper.id, {
      status: 'completed',
      score,
      total: paper.questions.length,
      answers,
      completedAt: new Date().toISOString(),
    })
  }

  return (
    <>
      <div className="topbar">
        <div>
          <p className="kicker">Listening · {paper.year}</p>
          <h1>{paper.title}</h1>
          <p className="muted">{paper.intro}</p>
        </div>
        <button className="btn-ghost" onClick={() => go('#/practice/listening')}>
          返回列表
        </button>
      </div>

      <div className="btn-row" style={{ marginBottom: 16 }}>
        <button className={`chip ${tab === 'listen' ? 'active' : ''}`} onClick={() => setTab('listen')}>
          1. 精听
        </button>
        <button className={`chip ${tab === 'dictation' ? 'active' : ''}`} onClick={() => setTab('dictation')}>
          2. 听写
        </button>
        <button className={`chip ${tab === 'quiz' ? 'active' : ''}`} onClick={() => setTab('quiz')}>
          3. 答题
        </button>
      </div>

      {tab === 'listen' && (
        <div className="card">
          <div className="btn-row" style={{ marginBottom: 16 }}>
            <button className="btn" onClick={() => speakEnglish(fullText, rate)}>
              播放全文
            </button>
            <button className="btn-ghost" onClick={stopSpeak}>
              停止
            </button>
            <button className="btn-ghost" onClick={() => setHide((v) => !v)}>
              {hide ? '显示文本' : '隐藏文本'}
            </button>
            <select value={rate} onChange={(e) => setRate(Number(e.target.value))} style={{ width: 120 }}>
              <option value={0.75}>0.75x 慢速</option>
              <option value={0.95}>0.95x 精听</option>
              <option value={1}>1.0x</option>
              <option value={1.15}>1.15x</option>
            </select>
          </div>
          {paper.script.map((line, i) => (
            <div className="script-line" key={`${line.speaker}-${i}`}>
              <div className="speaker">{line.speaker}</div>
              <div className="passage" style={{ fontSize: 17 }}>
                {hide ? '························' : line.text}
              </div>
              <button className="btn-ghost" onClick={() => speakEnglish(line.text, rate)}>
                听这句
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'dictation' && (
        <div className="grid">
          <p className="muted">先听，再默写整句。标点可以忽略，拼写要尽量准。</p>
          {paper.dictation.map((item, i) => {
            const typed = dictation[item.id] ?? ''
            const ok = checked && normalizeAnswer(typed) === normalizeAnswer(item.full)
            return (
              <div className="card" key={item.id}>
                <div className="paper-row">
                  <h3>句子 {i + 1}</h3>
                  <button className="btn-ghost" onClick={() => speakEnglish(item.full, rate)}>
                    播放
                  </button>
                </div>
                <textarea
                  value={typed}
                  onChange={(e) => setDictation((prev) => ({ ...prev, [item.id]: e.target.value }))}
                  placeholder="在这里写下你听到的整句"
                />
                {checked && (
                  <div className="explain">
                    {ok ? '听写正确。' : '再听一遍，对照原文。'}
                    <div className="passage" style={{ fontSize: 16, marginTop: 8 }}>
                      {item.full}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          <div className="btn-row">
            <button className="btn" onClick={() => setChecked(true)}>
              对照原文
            </button>
            <button className="btn-ghost" onClick={() => { setChecked(false); setDictation({}) }}>
              清空重写
            </button>
          </div>
        </div>
      )}

      {tab === 'quiz' && (
        <div className="grid">
          <Quiz
            questions={paper.questions}
            answers={answers}
            revealed={revealed}
            onPick={(id, key) => {
              const next = { ...answers, [id]: key }
              setAnswers(next)
              savePaper('listening', paper.id, { status: 'in_progress', answers: next })
            }}
          />
          <div className="btn-row">
            {!revealed ? (
              <button className="btn" onClick={submit}>
                交卷并收入错题
              </button>
            ) : (
              <div className="card">
                本次 {saved?.score ?? paper.questions.filter((q) => answers[q.id] === q.answer).length}/
                {paper.questions.length}。错题已记入错题本。
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
