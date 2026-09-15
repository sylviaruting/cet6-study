import { useEffect, useState } from 'react'
import { addStudyMinutes } from '../store'

const TICK_MS = 60_000
const IDLE_MS = 2 * 60_000

const ACTIVITY = [
  'mousemove',
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
  'pointerdown',
  'wheel',
] as const

export function useStudyTimer() {
  const [running, setRunning] = useState(
    () => typeof document !== 'undefined' && document.visibilityState === 'visible',
  )

  useEffect(() => {
    let lastActive = Date.now()
    let visible = document.visibilityState === 'visible'

    const isIdle = () => Date.now() - lastActive >= IDLE_MS

    const sync = () => {
      setRunning(visible && !isIdle())
    }

    const markActive = () => {
      lastActive = Date.now()
      if (visible) setRunning(true)
    }

    const onVisibility = () => {
      visible = document.visibilityState === 'visible'
      if (visible) lastActive = Date.now()
      sync()
    }

    const onLeave = () => {
      visible = false
      setRunning(false)
    }

    const tick = window.setInterval(() => {
      if (visible && !isIdle()) addStudyMinutes(1)
      else setRunning(false)
    }, TICK_MS)

    const idleWatch = window.setInterval(sync, 1000)

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', onLeave)
    window.addEventListener('focus', markActive)
    ACTIVITY.forEach((name) => window.addEventListener(name, markActive, { passive: true }))

    sync()

    return () => {
      window.clearInterval(tick)
      window.clearInterval(idleWatch)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', onLeave)
      window.removeEventListener('focus', markActive)
      ACTIVITY.forEach((name) => window.removeEventListener(name, markActive))
    }
  }, [])

  return running
}
