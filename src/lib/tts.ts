let voicesReady = false

function ensureVoices() {
  if (voicesReady) return
  window.speechSynthesis.getVoices()
  voicesReady = true
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    voicesReady = true
  }
}

export function speakEnglish(text: string, rate = 0.95) {
  if (!window.speechSynthesis) return
  ensureVoices()
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = 'en-US'
  utter.rate = rate
  const voices = window.speechSynthesis.getVoices()
  const en =
    voices.find((v) => v.lang.startsWith('en-US') && /Samantha|Ava|Alex|Google/i.test(v.name)) ??
    voices.find((v) => v.lang.startsWith('en'))
  if (en) utter.voice = en
  window.speechSynthesis.speak(utter)
}

export function stopSpeak() {
  window.speechSynthesis?.cancel()
}

export function normalizeAnswer(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\w\s']/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
