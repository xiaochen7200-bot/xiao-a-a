/** 将秒数格式化为 HH:MM:SS */
export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return [h, m, sec].map((n) => String(n).padStart(2, '0')).join(':')
}

/** 今日日期 YYYY-MM-DD */
export function getTodayDateString(): string {
  return formatDate(new Date())
}

function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** 判断 ISO 时间字符串是否为今天 */
export function isToday(dateString: string): boolean {
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return false
  return formatDate(d) === getTodayDateString()
}

/** 本周一 00:00:00 */
export function getWeekStartDate(): Date {
  const now = new Date()
  const day = now.getDay()
  const diff = day === 0 ? 6 : day - 1
  const monday = new Date(now)
  monday.setDate(now.getDate() - diff)
  monday.setHours(0, 0, 0, 0)
  return monday
}

/** 最近 7 天日期字符串（含今天，从旧到新） */
export function getLast7Days(): string[] {
  const days: string[] = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push(formatDate(d))
  }
  return days
}

/** 短日期标签，如 5/19 */
export function formatShortLabel(dateStr: string): string {
  const [, m, d] = dateStr.split('-')
  return `${Number(m)}/${Number(d)}`
}

/** 时间段显示 HH:mm - HH:mm */
export function formatTimeRange(start: string, end: string): string {
  const fmt = (iso: string) => {
    const d = new Date(iso)
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }
  return `${fmt(start)} - ${fmt(end)}`
}

/** 计算活动会话当前已用秒数 */
export function getActiveElapsedSeconds(
  active: {
    startTime: string
    elapsedBeforePause: number
    isPaused: boolean
    pausedAt?: string
  },
  now = Date.now(),
): number {
  if (active.isPaused) {
    return active.elapsedBeforePause
  }
  const segment = (now - new Date(active.startTime).getTime()) / 1000
  return active.elapsedBeforePause + Math.max(0, segment)
}
