import { useEffect, useMemo, useState } from 'react'
import { WORDS } from '../data/words'
import { speakWord, stopSpeak } from '../lib/tts'
import { addMistake, isWordDue, reviewWord, useStore } from '../store'
import type { WordItem } from '../types'

type Mode = 'cards' | 'choice' | 'spell' | 'list'

function shuffle<T>(arr: T[]) {
  return arr
    .map((item) => ({ item, n: Math.random() }))
    .sort((a, b) => a.n - b.n)
    .map((x) => x.item)
}

export function Vocabulary() {
  const state = useStore()
  const [mode, setMode] = useState<Mode>('cards')
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [filter, setFilter] = useState<'due' | 'all'>('due')
  const [choice, setChoice] = useState<string | null>(null)
  const [spell, setSpell] = useState('')
  const [spellChecked, setSpellChecked] = useState(false)

  const pool = useMemo(() => {
    const list = filter === 'due' ? WORDS.filter((w) => isWordDue(state.words[w.id])) : WORDS
    return list.length ? list : WORDS
  }, [filter, state.words])

  const word = pool[index % pool.length]
  const progress = state.words[word.id]
  const mastered = Object.values(state.words).filter((w) => w.status === 'mastered').length
  const learning = Object.values(state.words).filter((w) => w.status === 'learning' || w.status === 'reviewing').length

  const options = useMemo(() => {
    const others = shuffle(WORDS.filter((w) => w.id !== word.id)).slice(0, 3)
    return shuffle([word, ...others])
  }, [word.id])

  const next = () => {
    setIndex((i) => i + 1)
    setFlipped(false)
    setChoice(null)
    setSpell('')
    setSpellChecked(false)
  }

  useEffect(() => {
    if (mode === 'list') return
    if (mode === 'spell' && !spellChecked) return
    speakWord(word.word)
    return () => stopSpeak()
  }, [word.id, mode, spellChecked])

  const mark = (knew: boolean, source: WordItem, userAnswer?: string) => {
    reviewWord(source.id, knew)
    if (!knew) {
      addMistake({
        module: 'vocab',
        wordId: source.id,
        prompt: `${source.word} ${source.phonetic}`,
        userAnswer: userAnswer ?? '不认识',
        correctAnswer: source.meaning,
        explanation: source.example,
      })
    }
    next()
  }

  return (
    <>
      <div className="topbar">
        <div>
          <p className="kicker">Vocabulary</p>
          <h1>六级单词</h1>
          <p className="muted">先求见面眼熟，再求拼写。每个单词会自动播词典英式录音，也可再点「英音」重听。</p>
        </div>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 18 }}>
        <div className="card">
          <div className="stat-label">今日已复习</div>
          <div className="stat-num">{state.daily.wordsReviewed}</div>
        </div>
        <div className="card">
          <div className="stat-label">到期 / 新词</div>
          <div className="stat-num">{WORDS.filter((w) => isWordDue(state.words[w.id])).length}</div>
        </div>
        <div className="card">
          <div className="stat-label">学习中</div>
          <div className="stat-num">{learning}</div>
        </div>
        <div className="card">
          <div className="stat-label">已掌握</div>
          <div className="stat-num">{mastered}</div>
        </div>
      </div>

      <div className="btn-row" style={{ marginBottom: 16 }}>
        {(
          [
            ['cards', '卡片'],
            ['choice', '选择'],
            ['spell', '拼写'],
            ['list', '词表'],
          ] as const
        ).map(([id, label]) => (
          <button key={id} className={`chip ${mode === id ? 'active' : ''}`} onClick={() => { setMode(id); next() }}>
            {label}
          </button>
        ))}
        <button className={`chip ${filter === 'due' ? 'active' : ''}`} onClick={() => setFilter('due')}>
          只看到期
        </button>
        <button className={`chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          全部词库
        </button>
      </div>

      {mode === 'cards' && (
        <div className="card flash" onClick={() => setFlipped((v) => !v)}>
          <div className="module-en">{progress?.status ?? 'new'}</div>
          {!flipped ? (
            <>
              <div className="word">{word.word}</div>
              <p className="ipa">{word.phonetic} · {word.pos}</p>
              <p className="muted">点击翻面</p>
            </>
          ) : (
            <>
              <h2>{word.meaning}</h2>
              <p className="passage" style={{ fontSize: 18, marginTop: 12 }}>
                {word.example}
              </p>
              <p className="muted">{word.exampleCn}</p>
            </>
          )}
          <div className="btn-row" style={{ marginTop: 20 }} onClick={(e) => e.stopPropagation()}>
            <button className="btn-ghost" onClick={() => speakWord(word.word)}>
              英音
            </button>
            <button className="btn-danger" onClick={() => mark(false, word)}>
              不认识
            </button>
            <button className="btn" onClick={() => mark(true, word)}>
              认识
            </button>
          </div>
        </div>
      )}

      {mode === 'choice' && (
        <div className="card">
          <div className="word" style={{ fontFamily: 'Fraunces, serif', fontSize: 40 }}>
            {word.word}
          </div>
          <p className="ipa">{word.phonetic}</p>
          <div style={{ marginTop: 16 }}>
            {options.map((opt) => {
              let cls = 'opt'
              if (choice) {
                if (opt.id === word.id) cls += ' right'
                else if (choice === opt.id) cls += ' wrong'
              }
              return (
                <button
                  key={opt.id}
                  className={cls}
                  disabled={!!choice}
                  onClick={() => {
                    setChoice(opt.id)
                    window.setTimeout(() => mark(opt.id === word.id, word, opt.meaning), 450)
                  }}
                >
                  {opt.meaning}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {mode === 'spell' && (
        <div className="card">
          <h2>{word.meaning}</h2>
          <p className="muted">{word.pos} · 根据中文写出英文单词</p>
          <input
            type="text"
            value={spell}
            onChange={(e) => setSpell(e.target.value)}
            placeholder="在这里拼写"
            style={{ margin: '16px 0' }}
          />
          {spellChecked && (
            <div className="explain">
              正确答案：{word.word} {word.phonetic}
            </div>
          )}
          <div className="btn-row">
            <button
              className="btn"
              onClick={() => {
                const ok = spell.trim().toLowerCase() === word.word.toLowerCase()
                setSpellChecked(true)
                window.setTimeout(() => mark(ok, word, spell || '空白'), 500)
              }}
            >
              检查
            </button>
            <button className="btn-ghost" onClick={() => speakWord(word.word)}>
              听英音
            </button>
          </div>
        </div>
      )}

      {mode === 'list' && (
        <div className="grid">
          {WORDS.map((w) => {
            const st = state.words[w.id]
            return (
              <div className="card paper-row" key={w.id}>
                <div>
                  <h3>
                    {w.word} <span className="muted">{w.phonetic}</span>
                  </h3>
                  <div>
                    {w.pos} · {w.meaning}
                  </div>
                  <div className="muted">{w.example}</div>
                </div>
                <span className={st?.status === 'mastered' ? 'tag done' : 'tag'}>
                  {st?.status ?? 'new'}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
