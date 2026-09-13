export type ModuleId =
  | 'listening'
  | 'reading'
  | 'translation'
  | 'matching'
  | 'writing'

export type PageName =
  | 'home'
  | 'practice'
  | 'listening'
  | 'reading'
  | 'translation'
  | 'matching'
  | 'writing'
  | 'vocab'
  | 'mistakes'

export interface Page {
  name: PageName
  module?: ModuleId
  paperId?: string
}

export interface ChoiceQ {
  id: string
  stem: string
  options: { key: string; text: string }[]
  answer: string
  explanation: string
}

export interface ListeningPaper {
  id: string
  title: string
  year: string
  type: 'conversation' | 'lecture'
  durationMin: number
  intro: string
  script: { speaker: string; text: string }[]
  dictation: { id: string; full: string }[]
  questions: ChoiceQ[]
}

export interface ReadingPaper {
  id: string
  title: string
  year: string
  minutes: number
  passageTitle: string
  passage: string
  questions: ChoiceQ[]
}

export interface MatchingPaper {
  id: string
  title: string
  year: string
  theme: string
  paragraphs: { key: string; text: string }[]
  items: { id: string; text: string; answer: string; explanation: string }[]
}

export interface TranslationPaper {
  id: string
  title: string
  year: string
  source: string
  keypoints: string[]
  reference: string
  notes: string
}

export interface WritingPaper {
  id: string
  title: string
  year: string
  prompt: string
  outline: string[]
  sample: string
  rubric: { name: string; desc: string }[]
}

export interface WordItem {
  id: string
  word: string
  phonetic: string
  pos: string
  meaning: string
  example: string
  exampleCn: string
}

export type WordStatus = 'new' | 'learning' | 'reviewing' | 'mastered'

export interface WordProgress {
  status: WordStatus
  interval: number
  nextReview: string
  reviews: number
  wrongs: number
}

export interface PaperProgress {
  status: 'not_started' | 'in_progress' | 'completed'
  score?: number
  total?: number
  answers?: Record<string, string>
  text?: string
  selfScore?: number
  completedAt?: string
}

export interface Mistake {
  id: string
  module: ModuleId | 'vocab'
  paperId?: string
  questionId?: string
  wordId?: string
  prompt: string
  userAnswer: string
  correctAnswer: string
  explanation?: string
  createdAt: string
  mastered: boolean
}

export interface AppState {
  profile: {
    name: string
    targetScore: number
    examDate: string
  }
  streak: {
    lastDate: string
    count: number
    history: string[]
  }
  progress: Record<ModuleId, Record<string, PaperProgress>>
  words: Record<string, WordProgress>
  mistakes: Mistake[]
  daily: {
    date: string
    wordsReviewed: number
    papersDone: number
    minutes: number
  }
  planChecks: Record<string, boolean>
  updatedAt: string
}

export type PersistStatus = 'idle' | 'saving' | 'saved' | 'local-only' | 'error'

export interface PersistInfo {
  status: PersistStatus
  lastSavedAt: string
  hydrated: boolean
}
