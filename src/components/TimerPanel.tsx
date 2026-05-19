import { useEffect, useState } from 'react'
import { DEFAULT_CATEGORIES } from '../constants'
import type { ActiveSession } from '../types'
import { formatDuration, getActiveElapsedSeconds } from '../utils/time'
import { TechPanel, TechSectionTitle } from './ui/TechPanel'

interface TimerPanelProps {
  active: ActiveSession | null
  onActiveChange: (session: ActiveSession | null) => void
  onRequestFinish: (elapsedSeconds: number) => void
}

export default function TimerPanel({
  active,
  onActiveChange,
  onRequestFinish,
}: TimerPanelProps) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0].name)
  const [elapsed, setElapsed] = useState(0)

  const isRunning = active !== null
  const isPaused = active?.isPaused ?? false
  const locked = isRunning

  useEffect(() => {
    if (active) {
      setTitle(active.title)
      setCategory(active.category)
    }
  }, [active?.title, active?.category, active])

  useEffect(() => {
    if (!active) {
      setTitle('')
      setCategory(DEFAULT_CATEGORIES[0].name)
      setElapsed(0)
    }
  }, [active])

  useEffect(() => {
    if (!active) return
    if (active.isPaused) {
      setElapsed(active.elapsedBeforePause)
      return
    }
    const update = () => setElapsed(getActiveElapsedSeconds(active))
    update()
    const id = window.setInterval(update, 1000)
    return () => clearInterval(id)
  }, [active])

  const persist = (session: ActiveSession) => onActiveChange(session)

  const handleStart = () => {
    if (!title.trim()) {
      alert('请填写工作标题')
      return
    }
    if (!category) {
      alert('请选择工作分类')
      return
    }
    persist({
      title: title.trim(),
      category,
      startTime: new Date().toISOString(),
      elapsedBeforePause: 0,
      isPaused: false,
    })
  }

  const handlePause = () => {
    if (!active) return
    persist({
      ...active,
      elapsedBeforePause: getActiveElapsedSeconds(active),
      isPaused: true,
      pausedAt: new Date().toISOString(),
    })
  }

  const handleResume = () => {
    if (!active) return
    persist({
      ...active,
      startTime: new Date().toISOString(),
      isPaused: false,
      pausedAt: undefined,
    })
  }

  const handleFinish = () => {
    if (!active) return
    const total = active.isPaused
      ? active.elapsedBeforePause
      : getActiveElapsedSeconds(active)
    onRequestFinish(total)
  }

  return (
    <TechPanel>
      <TechSectionTitle>当前计时器</TechSectionTitle>

      <div
        className={`tech-timer-ring mb-6 ${isRunning && !isPaused ? 'tech-timer-ring--active' : ''}`}
      >
        <p
          className="tech-timer-display text-center text-5xl sm:text-6xl"
          aria-live="polite"
        >
          {formatDuration(elapsed)}
        </p>
      </div>

      {isRunning && (
        <p className="mb-4 flex items-center justify-center gap-2 text-center font-mono text-xs text-cyan-400/80">
          <span className={`tech-status-dot ${isPaused ? 'tech-status-dot--paused' : ''}`} />
          {isPaused ? 'PAUSED' : 'RECORDING'} · {active.title}
        </p>
      )}

      <div className="space-y-4">
        <div>
          <label className="tech-label">工作标题</label>
          <input
            type="text"
            value={title}
            disabled={locked}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="今天要做什么？"
            className="tech-input"
          />
        </div>

        <div>
          <label className="tech-label">工作分类</label>
          <select
            value={category}
            disabled={locked}
            onChange={(e) => setCategory(e.target.value)}
            className="tech-select"
          >
            {DEFAULT_CATEGORIES.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {!isRunning && (
            <button
              type="button"
              onClick={handleStart}
              className="tech-btn tech-btn-primary flex-1 px-4 py-3"
            >
              开始计时
            </button>
          )}
          {isRunning && isPaused && (
            <button
              type="button"
              onClick={handleResume}
              className="tech-btn tech-btn-success flex-1 px-4 py-3"
            >
              继续
            </button>
          )}
          {isRunning && !isPaused && (
            <button
              type="button"
              onClick={handlePause}
              className="tech-btn tech-btn-warning flex-1 px-4 py-3"
            >
              暂停
            </button>
          )}
          {isRunning && (
            <button
              type="button"
              onClick={handleFinish}
              className="tech-btn tech-btn-ghost flex-1 px-4 py-3"
            >
              结束并保存
            </button>
          )}
        </div>
      </div>
    </TechPanel>
  )
}
