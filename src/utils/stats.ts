import type { CategoryStat, DayStat, WorkSession } from '../types'
import {
  formatShortLabel,
  getLast7Days,
  getTodayDateString,
  getWeekStartDate,
  isToday,
} from './time'

export function getTodaySessions(sessions: WorkSession[]): WorkSession[] {
  return sessions.filter((s) => isToday(s.createdAt))
}

export function getTodayTotalSeconds(sessions: WorkSession[]): number {
  return getTodaySessions(sessions).reduce((sum, s) => sum + s.durationSeconds, 0)
}

export function getWeekTotalSeconds(sessions: WorkSession[]): number {
  const weekStart = getWeekStartDate().getTime()
  return sessions
    .filter((s) => new Date(s.createdAt).getTime() >= weekStart)
    .reduce((sum, s) => sum + s.durationSeconds, 0)
}

export function getCategoryStats(sessions: WorkSession[]): CategoryStat[] {
  const today = getTodaySessions(sessions)
  const total = today.reduce((sum, s) => sum + s.durationSeconds, 0)
  const map = new Map<string, { totalSeconds: number; taskCount: number }>()

  for (const s of today) {
    const cur = map.get(s.category) ?? { totalSeconds: 0, taskCount: 0 }
    cur.totalSeconds += s.durationSeconds
    cur.taskCount += 1
    map.set(s.category, cur)
  }

  return Array.from(map.entries())
    .map(([category, data]) => ({
      category,
      totalSeconds: data.totalSeconds,
      taskCount: data.taskCount,
      percentage: total > 0 ? (data.totalSeconds / total) * 100 : 0,
    }))
    .sort((a, b) => b.totalSeconds - a.totalSeconds)
}

export function getLast7DaysStats(sessions: WorkSession[]): DayStat[] {
  const days = getLast7Days()
  const today = getTodayDateString()

  return days.map((date) => {
    const totalSeconds = sessions
      .filter((s) => {
        const d = new Date(s.createdAt)
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${y}-${m}-${day}` === date
      })
      .reduce((sum, s) => sum + s.durationSeconds, 0)

    return {
      date,
      label: date === today ? '今天' : formatShortLabel(date),
      totalSeconds,
    }
  })
}
