import { STORAGE_KEYS } from '../constants'
import type { ActiveSession, WorkSession } from '../types'

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getSessions(): WorkSession[] {
  return readJson<WorkSession[]>(STORAGE_KEYS.sessions, [])
}

export function saveSessions(sessions: WorkSession[]): void {
  writeJson(STORAGE_KEYS.sessions, sessions)
}

export function addSession(session: WorkSession): void {
  const sessions = getSessions()
  sessions.unshift(session)
  saveSessions(sessions)
}

export function deleteSession(id: string): void {
  saveSessions(getSessions().filter((s) => s.id !== id))
}

export function getActiveSession(): ActiveSession | null {
  return readJson<ActiveSession | null>(STORAGE_KEYS.active, null)
}

export function saveActiveSession(session: ActiveSession): void {
  writeJson(STORAGE_KEYS.active, session)
}

export function clearActiveSession(): void {
  localStorage.removeItem(STORAGE_KEYS.active)
}
