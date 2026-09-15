import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'
import nodemailer from 'nodemailer'

export interface WeeklySnapshot {
  name: string
  targetScore: number
  examDate: string
  daysToExam: number
  weekStart: string
  weekEnd: string
  phaseTitle: string
  phaseGoal: string
  planned: number
  checked: number
  daysFull: number
  daysInWeek: number
  missed: string[]
  streak: number
  wordsMastered: number
  wordsTouched: number
  wordBank: number
  papers: { module: string; paperId: string; status: string; score?: string }[]
  mistakesByModule: { module: string; open: number }[]
  openMistakes: number
}

const root = path.dirname(fileURLToPath(import.meta.url))

function parseEnvFile(file: string) {
  if (!fs.existsSync(file)) return
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq < 1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (key) process.env[key] = value
  }
}

function loadEnv() {
  parseEnvFile(path.join(process.cwd(), '.env'))
  parseEnvFile(path.join(root, '.env'))
  config({ path: path.join(process.cwd(), '.env') })
}

loadEnv()

const stampFile = path.join(root, 'data', 'last-weekly-report.json')

const MAIL_TO = process.env.QQ_MAIL_TO || '1434193887@qq.com'
const MAIL_USER = process.env.QQ_SMTP_USER || '1434193887@qq.com'

export function reportConfig() {
  loadEnv()
  return {
    deepseek: Boolean(process.env.DEEPSEEK_API_KEY),
    smtp: Boolean(process.env.QQ_SMTP_PASS && MAIL_USER),
    mailTo: MAIL_TO,
    lastSent: readLastSent(),
  }
}

export function readLastSent() {
  try {
    const raw = JSON.parse(fs.readFileSync(stampFile, 'utf8')) as { sentAt?: string }
    return raw.sentAt ?? ''
  } catch {
    return ''
  }
}

function writeLastSent(sentAt: string) {
  fs.mkdirSync(path.dirname(stampFile), { recursive: true })
  fs.writeFileSync(stampFile, JSON.stringify({ sentAt, mailTo: MAIL_TO }, null, 2))
}

function mondayOf(date: Date) {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const day = copy.getDay()
  copy.setDate(copy.getDate() + (day === 0 ? -6 : 1 - day))
  return copy.toISOString().slice(0, 10)
}

export function isReportDue(lastSent = readLastSent()) {
  if (!lastSent) return new Date().getDay() === 0
  return mondayOf(new Date(lastSent)) < mondayOf(new Date())
}

async function analyzeWithDeepSeek(snapshot: WeeklySnapshot) {
  const key = process.env.DEEPSEEK_API_KEY
  if (!key) throw new Error('还没有配置 DEEPSEEK_API_KEY')

  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content:
            '你是六级备考教练。根据学生本周数据写一份中文周报，语气干脆、具体、不空夸。结构固定为：1) 本周判断 2) 对照计划的缺口 3) 下周三件最值得做的事。控制在 500 字内。考试日是 2026-12-12。',
        },
        {
          role: 'user',
          content: `请分析这份六级学习周报数据：\n${JSON.stringify(snapshot, null, 2)}`,
        },
      ],
    }),
  })

  if (!res.ok) {
    throw new Error(`DeepSeek 请求失败：${res.status} ${await res.text()}`)
  }
  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  const text = json.choices?.[0]?.message?.content?.trim()
  if (!text) throw new Error('DeepSeek 没有返回分析内容')
  return text
}

function toHtml(text: string) {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
  return `<!doctype html>
<html><body style="font-family:Source Han Serif SC,Songti SC,serif;color:#1c2230;line-height:1.7;padding:24px;">
  <h1 style="font-size:22px;">六级书房 · 每周学情</h1>
  <p style="color:#8a6733;">DeepSeek 分析 · 仅发送给你自己</p>
  <div>${escaped}</div>
</body></html>`
}

async function sendMail(subject: string, analysis: string, snapshot: WeeklySnapshot) {
  const pass = process.env.QQ_SMTP_PASS
  if (!pass) throw new Error('还没有配置 QQ_SMTP_PASS（QQ 邮箱 SMTP 授权码）')

  const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: { user: MAIL_USER, pass },
  })

  await transporter.sendMail({
    from: `"六级书房" <${MAIL_USER}>`,
    to: MAIL_TO,
    subject,
    text: analysis,
    html: `${toHtml(analysis)}
      <hr/>
      <p>本周打卡 ${snapshot.checked}/${snapshot.planned}，全勤 ${snapshot.daysFull}/${snapshot.daysInWeek} 天，连续 ${snapshot.streak} 天，未消化错题 ${snapshot.openMistakes}。</p>`,
  })
}

let sending = false

export async function runWeeklyReport(snapshot: WeeklySnapshot, force = false) {
  const cfg = reportConfig()
  if (!force && !isReportDue(cfg.lastSent)) {
    return { ok: true, skipped: true, lastSent: cfg.lastSent, mailTo: MAIL_TO }
  }
  if (sending) {
    return { ok: true, skipped: true, lastSent: cfg.lastSent, mailTo: MAIL_TO }
  }
  sending = true
  if (!cfg.deepseek) throw new Error('还没有配置 DEEPSEEK_API_KEY')
  if (!cfg.smtp) throw new Error('还没有配置 QQ 邮箱 SMTP 授权码')

  try {
    const analysis = await analyzeWithDeepSeek(snapshot)
    const subject = `六级书房周报 ${snapshot.weekStart} ~ ${snapshot.weekEnd}`
    await sendMail(subject, analysis, snapshot)
    const sentAt = new Date().toISOString()
    writeLastSent(sentAt)
    return { ok: true, skipped: false, sentAt, mailTo: MAIL_TO, analysis }
  } finally {
    sending = false
  }
}
