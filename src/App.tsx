import { useEffect, useState, type ReactNode } from 'react'
import { Layout } from './components/Layout'
import { parseHash } from './lib/nav'
import { Home } from './pages/Home'
import { Listening } from './pages/Listening'
import { Matching } from './pages/Matching'
import { Mistakes } from './pages/Mistakes'
import { Practice } from './pages/Practice'
import { Reading } from './pages/Reading'
import { Translation } from './pages/Translation'
import { Vocabulary } from './pages/Vocabulary'
import { Writing } from './pages/Writing'
import type { Page } from './types'

export default function App() {
  const [page, setPage] = useState<Page>(parseHash)

  useEffect(() => {
    const onHash = () => setPage(parseHash())
    window.addEventListener('hashchange', onHash)
    if (!window.location.hash) window.location.hash = '#/home'
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  let body: ReactNode = <Home />
  if (page.name === 'practice') body = <Practice module={page.module} />
  if (page.name === 'listening' && page.paperId) body = <Listening paperId={page.paperId} />
  if (page.name === 'reading' && page.paperId) body = <Reading paperId={page.paperId} />
  if (page.name === 'matching' && page.paperId) body = <Matching paperId={page.paperId} />
  if (page.name === 'translation' && page.paperId) body = <Translation paperId={page.paperId} />
  if (page.name === 'writing' && page.paperId) body = <Writing paperId={page.paperId} />
  if (page.name === 'vocab') body = <Vocabulary />
  if (page.name === 'mistakes') body = <Mistakes />

  return <Layout page={page}>{body}</Layout>
}
