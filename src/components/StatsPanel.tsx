import type { CategoryStat, DayStat, WorkSession } from '../types'
import {
  getCategoryStats,
  getLast7DaysStats,
  getTodaySessions,
  getTodayTotalSeconds,
  getWeekTotalSeconds,
} from '../utils/stats'
import { formatDuration } from '../utils/time'
import { TechPanel, TechSectionTitle } from './ui/TechPanel'

interface StatsPanelProps {
  sessions: WorkSession[]
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="tech-card p-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="tech-stat-value mt-1">{value}</p>
      {sub && <p className="mt-1 font-mono text-[10px] text-slate-600">{sub}</p>}
    </div>
  )
}

function BarChart({ days }: { days: DayStat[] }) {
  const max = Math.max(...days.map((d) => d.totalSeconds), 1)

  return (
    <div className="mt-4">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-cyan-500/60">
        7-DAY WORKLOAD
      </p>
      <div className="flex h-32 items-end justify-between gap-1 border border-cyan-500/10 bg-black/20 p-3">
        {days.map((d) => {
          const h = (d.totalSeconds / max) * 100
          return (
            <div key={d.date} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="font-mono text-[9px] text-cyan-400/50">
                {d.totalSeconds > 0 ? formatDuration(d.totalSeconds).slice(0, 5) : '—'}
              </span>
              <div className="flex w-full flex-1 items-end justify-center">
                <div
                  className="tech-bar w-full max-w-[28px] rounded-t-sm"
                  style={{
                    height: `${Math.max(h, d.totalSeconds > 0 ? 10 : 3)}%`,
                  }}
                  title={`${d.label}: ${formatDuration(d.totalSeconds)}`}
                />
              </div>
              <span className="font-mono text-[9px] text-slate-500">{d.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CategoryBreakdown({ stats }: { stats: CategoryStat[] }) {
  if (stats.length === 0) {
    return (
      <p className="font-mono text-xs text-slate-500">NO CATEGORY DATA TODAY</p>
    )
  }

  return (
    <ul className="mt-3 space-y-3">
      {stats.map((s) => (
        <li key={s.category}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-slate-300">{s.category}</span>
            <span className="font-mono text-xs text-cyan-400">
              {formatDuration(s.totalSeconds)} · {s.taskCount}
            </span>
          </div>
          <div className="tech-progress-track">
            <div className="tech-progress-fill" style={{ width: `${s.percentage}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function StatsPanel({ sessions }: StatsPanelProps) {
  const todaySessions = getTodaySessions(sessions)
  const todaySeconds = getTodayTotalSeconds(sessions)
  const weekSeconds = getWeekTotalSeconds(sessions)
  const categoryStats = getCategoryStats(sessions)
  const last7Days = getLast7DaysStats(sessions)

  return (
    <TechPanel>
      <TechSectionTitle>数据统计</TechSectionTitle>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="今日总时长" value={formatDuration(todaySeconds)} />
        <StatCard label="今日任务数" value={String(todaySessions.length)} />
        <StatCard
          label="本周总时长"
          value={formatDuration(weekSeconds)}
          sub="MON — TODAY"
        />
      </div>

      <BarChart days={last7Days} />

      <div className="mt-6 border-t border-cyan-500/15 pt-4">
        <p className="font-mono text-[10px] uppercase tracking-wider text-cyan-500/60">
          分类用时 / 任务数
        </p>
        <CategoryBreakdown stats={categoryStats} />
      </div>
    </TechPanel>
  )
}
