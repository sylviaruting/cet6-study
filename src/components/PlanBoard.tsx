import { useEffect, useMemo, useRef, useState } from 'react'
import {
  PHASES,
  PLAN_DAYS,
  dayDone,
  dayScore,
  findToday,
  planKey,
  shortDate,
  todayKey,
  type PhaseId,
  type PlanDay,
} from '../data/plan'
import { go } from '../lib/nav'
import { togglePlanTask, useStore } from '../store'

export function PlanBoard() {
  const state = useStore()
  const checks = state.planChecks
  const today = findToday()
  const currentPhase = today?.phase ?? 'p1'
  const [phase, setPhase] = useState<PhaseId>(currentPhase)
  const todayRef = useRef<HTMLTableRowElement | null>(null)

  useEffect(() => {
    todayRef.current?.scrollIntoView({ block: 'nearest' })
  }, [phase])

  const rows = useMemo(() => PLAN_DAYS.filter((d) => d.phase === phase), [phase])
  const weeks = useMemo(() => {
    const map = new Map<string, PlanDay[]>()
    rows.forEach((day) => {
      const list = map.get(day.weekLabel) ?? []
      list.push(day)
      map.set(day.weekLabel, list)
    })
    return [...map.entries()]
  }, [rows])

  const doneDays = PLAN_DAYS.filter((d) => dayDone(d, checks)).length
  const todayScore = today ? dayScore(today, checks) : null
  const meta = PHASES.find((p) => p.id === phase)!

  return (
    <section className="card plan-board">
      <div className="paper-row" style={{ alignItems: 'flex-start' }}>
        <div>
          <p className="kicker">Study plan</p>
          <h2>学习计划打卡</h2>
          <p className="muted">
            9.13 到 12.12，按阶段每天勾掉要求的任务。已完成 {doneDays}/{PLAN_DAYS.length} 天。
          </p>
        </div>
      </div>

      {today ? (
        <div className="today-plan">
          <div className="paper-row">
            <div>
              <p className="kicker">今日任务 · {shortDate(today.date)} 周{today.weekday}</p>
              <h3>
                {today.phaseTitle} · {today.weekLabel}
              </h3>
              <p className="muted">{today.focus}</p>
            </div>
            <span className={todayScore && todayScore.done === todayScore.total ? 'tag done' : 'tag'}>
              {todayScore?.done}/{todayScore?.total}
            </span>
          </div>
          <div className="bar" style={{ margin: '10px 0 14px' }}>
            <i
              style={{
                width: `${todayScore && todayScore.total ? (todayScore.done / todayScore.total) * 100 : 0}%`,
              }}
            />
          </div>
          <div className="plan-tasks">
            {today.tasks.map((task) => {
              const checked = !!checks[planKey(today.date, task.id)]
              return (
                <label key={task.id} className={`plan-check ${checked ? 'done' : ''}`}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => togglePlanTask(today.date, task.id)}
                  />
                  <span>{task.label}</span>
                  {task.href && (
                    <button
                      type="button"
                      className="linkish"
                      onClick={(e) => {
                        e.preventDefault()
                        go(task.href!)
                      }}
                    >
                      去做
                    </button>
                  )}
                </label>
              )
            })}
          </div>
        </div>
      ) : (
        <p className="muted">今天不在计划日期内，可先切换阶段查看后面的安排。</p>
      )}

      <div className="btn-row" style={{ margin: '18px 0 12px' }}>
        {PHASES.map((p) => (
          <button
            key={p.id}
            className={`chip ${phase === p.id ? 'active' : ''}`}
            onClick={() => setPhase(p.id)}
          >
            {p.title.replace(' · ', ' ')}
          </button>
        ))}
      </div>

      <p className="muted" style={{ marginTop: 0 }}>
        {meta.range} · {meta.goal}
      </p>

      <div className="plan-scroll">
        <table className="plan-table">
          <thead>
            <tr>
              <th>日期</th>
              <th>周次</th>
              <th>当日任务（勾选即打卡）</th>
              <th>完成</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map(([week, days]) =>
              days.map((day, i) => {
                const score = dayScore(day, checks)
                const isToday = day.date === todayKey()
                return (
                  <tr
                    key={day.date}
                    ref={isToday ? todayRef : undefined}
                    className={isToday ? 'is-today' : ''}
                  >
                    <td>
                      {shortDate(day.date)}
                      <div className="muted">周{day.weekday}</div>
                    </td>
                    <td>{i === 0 ? week : ''}</td>
                    <td>
                      <div className="plan-tasks compact">
                        {day.tasks.map((task) => {
                          const checked = !!checks[planKey(day.date, task.id)]
                          return (
                            <label key={task.id} className={`plan-check ${checked ? 'done' : ''}`}>
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => togglePlanTask(day.date, task.id)}
                              />
                              <span>{task.label}</span>
                            </label>
                          )
                        })}
                      </div>
                      <div className="plan-focus">{day.focus}</div>
                    </td>
                    <td>
                      <span className={score.done === score.total ? 'tag done' : 'tag'}>
                        {score.done}/{score.total}
                      </span>
                    </td>
                  </tr>
                )
              }),
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
