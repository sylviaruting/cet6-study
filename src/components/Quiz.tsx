import type { ChoiceQ } from '../types'

export function Quiz({
  questions,
  answers,
  revealed,
  onPick,
}: {
  questions: ChoiceQ[]
  answers: Record<string, string>
  revealed: boolean
  onPick: (id: string, key: string) => void
}) {
  return (
    <div className="grid">
      {questions.map((q, i) => {
        const picked = answers[q.id]
        return (
          <div className="card q-card" key={q.id}>
            <div className="q-stem">
              {i + 1}. {q.stem}
            </div>
            {q.options.map((opt) => {
              let cls = 'opt'
              if (revealed) {
                if (opt.key === q.answer) cls += ' right'
                else if (picked === opt.key) cls += ' wrong'
              } else if (picked === opt.key) {
                cls += ' picked'
              }
              return (
                <button
                  key={opt.key}
                  className={cls}
                  disabled={revealed}
                  onClick={() => onPick(q.id, opt.key)}
                >
                  {opt.key}. {opt.text}
                </button>
              )
            })}
            {revealed && <div className="explain">{q.explanation}</div>}
          </div>
        )
      })}
    </div>
  )
}
