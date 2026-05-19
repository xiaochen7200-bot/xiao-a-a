export interface WorkSession {
  id: string
  title: string
  category: string
  result: string
  note: string
  startTime: string
  endTime: string
  durationSeconds: number
  createdAt: string
}

export interface ActiveSession {
  title: string
  category: string
  startTime: string
  elapsedBeforePause: number
  isPaused: boolean
  pausedAt?: string
}

export interface Category {
  id: string
  name: string
  color: string
}

export interface CategoryStat {
  category: string
  totalSeconds: number
  taskCount: number
  percentage: number
}

export interface DayStat {
  date: string
  label: string
  totalSeconds: number
}
