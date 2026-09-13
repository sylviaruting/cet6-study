import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Connect, Plugin } from 'vite'

const root = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(root, 'data')
const dbFile = path.join(dataDir, 'cet6.db')
const legacyFile = path.join(dataDir, 'progress.json')
const backupDir = path.join(dataDir, 'backups')

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function writeAtomic(file: string, content: string) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const tmp = `${file}.tmp`
  fs.writeFileSync(tmp, content, 'utf8')
  fs.renameSync(tmp, file)
}

function readDb(): unknown | null {
  const file = fs.existsSync(dbFile) ? dbFile : fs.existsSync(legacyFile) ? legacyFile : null
  if (!file) return null
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function dailyBackup(content: string) {
  fs.mkdirSync(backupDir, { recursive: true })
  const day = new Date().toISOString().slice(0, 10)
  const target = path.join(backupDir, `cet6-${day}.db`)
  if (!fs.existsSync(target)) writeAtomic(target, content)
  const files = fs
    .readdirSync(backupDir)
    .filter((name) => name.startsWith('cet6-') && name.endsWith('.db'))
    .sort()
  while (files.length > 14) {
    const old = files.shift()
    if (old) fs.unlinkSync(path.join(backupDir, old))
  }
}

const handler: Connect.NextHandleFunction = (req, res, next) => {
  void handle(req, res, next)
}

async function handle(
  req: IncomingMessage,
  res: ServerResponse,
  next: Connect.NextFunction,
) {
  const url = req.url ?? ''
  if (!url.startsWith('/api/progress') && !url.startsWith('/api/db')) {
    next()
    return
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')

  try {
    if (req.method === 'GET') {
      res.end(JSON.stringify({ ok: true, data: readDb() }))
      return
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const body = await readBody(req)
      const parsed = JSON.parse(body)
      const pretty = JSON.stringify(parsed, null, 2)
      writeAtomic(dbFile, pretty)
      writeAtomic(legacyFile, pretty)
      dailyBackup(pretty)
      res.end(JSON.stringify({ ok: true, savedAt: parsed.updatedAt ?? new Date().toISOString() }))
      return
    }

    res.statusCode = 405
    res.end(JSON.stringify({ ok: false, error: 'method not allowed' }))
  } catch (error) {
    res.statusCode = 500
    res.end(JSON.stringify({ ok: false, error: String(error) }))
  }
}

export function persistProgress(): Plugin {
  return {
    name: 'persist-progress',
    configureServer(server) {
      server.middlewares.use(handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler)
    },
  }
}
