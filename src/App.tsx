import { useCallback, useEffect, useState } from 'react'
import CategorySummary from './components/CategorySummary'
import ResultModal from './components/ResultModal'
import StatsPanel from './components/StatsPanel'
import TimerPanel from './components/TimerPanel'
import TodayList from './components/TodayList'
import type { ActiveSession, WorkSession } from './types'
import {
  addSession,
  clearActiveSession,
  deleteSession,
  getActiveSession,
  getSessions,
  saveActiveSession,
} from './utils/storage'
import { getTodaySessions } from './utils/stats'
import { formatDuration } from './utils/time'

export default function App() {
  const [sessions, setSessions] = useState<WorkSession[]>(() => getSessions())
  const [active, setActive] = useState<ActiveSession | null>(() => getActiveSession())
  const [modalOpen, setModalOpen] = useState(false)
  const [pendingSeconds, setPendingSeconds] = useState(0)

  const refreshSessions = useCallback(() => {
    setSessions(getSessions())
  }, [])

  const handleActiveChange = (session: ActiveSession | null) => {
    setActive(session)
    if (session) {
      saveActiveSession(session)
    } else {
      clearActiveSession()
    }
  }

  const handleRequestFinish = (elapsedSeconds: number) => {
    setPendingSeconds(elapsedSeconds)
    setModalOpen(true)
  }

  const handleModalCancel = () => {
    setModalOpen(false)
  }

  const handleModalSave = (result: string, note: string) => {
    if (!active) return

    const end = new Date()
    const start = new Date(end.getTime() - pendingSeconds * 1000)

    const session: WorkSession = {
      id: crypto.randomUUID(),
      title: active.title,
      category: active.category,
      result,
      note,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      durationSeconds: Math.round(pendingSeconds),
      createdAt: end.toISOString(),
    }

    addSession(session)
    clearActiveSession()
    setActive(null)
    setModalOpen(false)
    refreshSessions()
  }

  const handleDelete = (id: string) => {
    deleteSession(id)
    refreshSessions()
  }

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key?.startsWith('ai-factory')) {
        setSessions(getSessions())
        setActive(getActiveSession())
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const todaySessions = getTodaySessions(sessions)
  const isTimerActive = active !== null && !active.isPaused

  return (
    <div className="tech-app-bg relative z-0">
      <header className="relative border-b border-cyan-500/20 bg-black/40 px-4 py-10 text-center backdrop-blur-sm sm:px-6">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
        </div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-500/80">
          AI CONTENT FACTORY · v1.0
        </p>
        <h1 className="tech-title text-2xl font-bold sm:text-4xl">
          AI内容工厂控制台
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400 sm:text-base">
          记录行为，看清产出，找到真正有效的工作。
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 font-mono text-[10px] text-cyan-400/90">
          <span
            className={`tech-status-dot ${isTimerActive ? '' : active ? 'tech-status-dot--paused' : 'opacity-30'}`}
          />
          {isTimerActive ? 'SYSTEM · TIMER ACTIVE' : active ? 'SYSTEM · PAUSED' : 'SYSTEM · STANDBY'}
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <TimerPanel
              active={active}
              onActiveChange={handleActiveChange}
              onRequestFinish={handleRequestFinish}
            />
          </div>
          <div className="lg:col-span-5">
            <TodayList sessions={todaySessions} onDelete={handleDelete} />
          </div>
          <div className="lg:col-span-4">
            <StatsPanel sessions={sessions} />
          </div>
        </div>

        <CategorySummary sessions={sessions} />
      </main>

      <footer className="pb-6 text-center font-mono text-[10px] tracking-widest text-slate-600">
        LOCAL STORAGE · NO CLOUD SYNC
      </footer>

      <ResultModal
        open={modalOpen}
        title={active?.title ?? ''}
        category={active?.category ?? ''}
        durationLabel={formatDuration(pendingSeconds)}
        onCancel={handleModalCancel}
        onSave={handleModalSave}
      />
    </div>
  )
}
