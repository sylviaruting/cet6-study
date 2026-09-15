import { useEffect, useRef, useState } from 'react'
import { buildWeeklySnapshot, weeklyReportDue } from '../lib/weekly-stats'
import { markWeeklyReportSent, useStore } from '../store'

type Status = {
  deepseek: boolean
  smtp: boolean
  mailTo: string
  lastSent: string
  due: boolean
}

export function WeeklyReport() {
  const state = useStore()
  const [info, setInfo] = useState<Status | null>(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const autoTried = useRef(false)

  const loadStatus = async () => {
    const res = await fetch('/api/weekly-report')
    if (!res.ok) return
    const json = (await res.json()) as Status & { ok: boolean }
    setInfo(json)
    return json
  }

  const send = async (force: boolean) => {
    setBusy(true)
    setMessage(force ? '正在生成并发送本周分析…' : '本周报告到期，正在发给你的邮箱…')
    try {
      const res = await fetch('/api/weekly-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snapshot: buildWeeklySnapshot(state), force }),
      })
      const json = (await res.json()) as {
        ok?: boolean
        skipped?: boolean
        sentAt?: string
        lastSent?: string
        mailTo?: string
        error?: string
      }
      if (!res.ok) throw new Error(json.error || '发送失败')
      if (json.skipped) {
        setMessage(`这周已经发过，下次会自动再发。收件箱：${json.mailTo}`)
      } else if (json.sentAt) {
        markWeeklyReportSent(json.sentAt)
        setMessage(`已发送到 ${json.mailTo}`)
      }
      await loadStatus()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '发送失败')
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    void loadStatus().then((status) => {
      if (!status || autoTried.current) return
      const due = status.due || weeklyReportDue(state.lastWeeklyReportAt)
      if (due && status.deepseek && status.smtp) {
        autoTried.current = true
        void send(false)
      }
    })
  }, [state.lastWeeklyReportAt])

  const ready = Boolean(info?.deepseek && info?.smtp)

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <p className="kicker">DeepSeek weekly review</p>
      <h2 style={{ marginBottom: 8 }}>每周学情分析</h2>
      <p className="muted" style={{ marginBottom: 12 }}>
        每周日或进入新的一周时，DeepSeek 会根据打卡、错题和做题记录写一份分析，发到{' '}
        {info?.mailTo || '1434193887@qq.com'}。学习时打开本页即可自动发送，不必手动点退出。
      </p>
      {!ready && (
        <p className="muted" style={{ marginBottom: 12 }}>
          还没接通。在项目根目录复制 <code>.env.example</code> 为 <code>.env</code>，填入
          DeepSeek API Key，以及 QQ 邮箱 SMTP 授权码，然后重启 <code>npm run dev</code>。
        </p>
      )}
      {info?.lastSent && (
        <p className="muted">上次发送：{new Date(info.lastSent).toLocaleString('zh-CN', { hour12: false })}</p>
      )}
      {message && <p className={message.includes('失败') || message.includes('没有') ? 'muted' : 'muted'}>{message}</p>}
      <div className="btn-row">
        <button className="btn" disabled={busy || !ready} onClick={() => void send(true)}>
          {busy ? '发送中…' : '立即生成本周分析'}
        </button>
      </div>
    </div>
  )
}
