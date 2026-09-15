let voicesReady = false
let player: HTMLAudioElement | null = null
let playToken = 0
const ukAudioCache = new Map<string, string>()

function allVoices() {
  return window.speechSynthesis?.getVoices() ?? []
}

function scoreBritishVoice(voice: SpeechSynthesisVoice) {
  const lang = voice.lang.replace('_', '-')
  const name = voice.name
  if (/zarvox|trinoids|whisper|superstar|bubbles|boing|jester|organ|cellos|bad news|good news|albert/i.test(name)) {
    return -1
  }

  let score = 0
  if (/^en-GB/i.test(lang) || /^en-UK/i.test(lang)) score += 60
  else if (/united kingdom|great britain|british/i.test(name)) score += 50
  else if (/^en/i.test(lang)) score += 2
  else return -1

  if (/daniel|martha|arthur|serena|kate|malcolm/i.test(name)) score += 40
  if (/premium|enhanced|eloquence/i.test(name)) score += 18
  if (/compact|mini/i.test(name)) score -= 20
  return score
}

export function pickBritishVoice() {
  const ranked = allVoices()
    .map((voice) => ({ voice, score: scoreBritishVoice(voice) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
  return ranked[0]?.voice ?? null
}

function ensureVoices() {
  if (voicesReady && allVoices().length) return
  allVoices()
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    voicesReady = true
  }
}

function speakBritish(text: string, rate: number) {
  if (!window.speechSynthesis) return
  ensureVoices()
  window.speechSynthesis.cancel()

  const start = () => {
    const utter = new SpeechSynthesisUtterance(text)
    const voice = pickBritishVoice()
    utter.lang = voice?.lang || 'en-GB'
    utter.rate = rate
    utter.pitch = 1
    utter.volume = 1
    if (voice) utter.voice = voice
    window.speechSynthesis.speak(utter)
  }

  if (!allVoices().length) {
    window.speechSynthesis.addEventListener(
      'voiceschanged',
      () => {
        voicesReady = true
        window.setTimeout(start, 30)
      },
      { once: true },
    )
    return
  }

  window.setTimeout(start, 40)
}

function youdaoUk(word: string) {
  return `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=1`
}

async function lookupUkAudio(word: string) {
  const key = word.toLowerCase().trim()
  const cached = ukAudioCache.get(key)
  if (cached) return cached

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(key)}`)
    if (res.ok) {
      const data = (await res.json()) as { phonetics?: { audio?: string }[] }[]
      const clips = data.flatMap((entry) => entry.phonetics ?? []).map((item) => item.audio ?? '')
      const uk = clips.find((src) => /uk|gb|british/i.test(src))
      if (uk) {
        ukAudioCache.set(key, uk)
        return uk
      }
    }
  } catch {
    /* 词典接口失败时改用有道英音 */
  }

  const fallback = youdaoUk(word)
  ukAudioCache.set(key, fallback)
  return fallback
}

function stopAudio() {
  if (!player) return
  player.onerror = null
  player.pause()
  player.removeAttribute('src')
  player.load()
  player = null
}

export function speakEnglish(text: string, rate = 0.92) {
  stopAudio()
  speakBritish(text, rate)
}

export async function speakWord(word: string) {
  const token = ++playToken
  stopAudio()
  window.speechSynthesis?.cancel()

  try {
    const url = await lookupUkAudio(word)
    if (token !== playToken) return
    const audio = new Audio(url)
    player = audio
    audio.preload = 'auto'
    audio.onerror = () => {
      if (token === playToken) speakBritish(word, 0.82)
    }
    await audio.play()
  } catch {
    if (token === playToken) speakBritish(word, 0.82)
  }
}

export function stopSpeak() {
  playToken += 1
  stopAudio()
  window.speechSynthesis?.cancel()
}

export function normalizeAnswer(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\w\s']/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
