import { DEFAULT_CATEGORIES } from '../constants'
import type { WorkSession } from '../types'
import { getCategoryStats, getTodayTotalSeconds } from '../utils/stats'
import { formatDuration } from '../utils/time'
import { TechPanel, TechSectionTitle } from './ui/TechPanel'

interface CategorySummaryProps {
  sessions: WorkSession[]
}

export default function CategorySummary({ sessions }: CategorySummaryProps) {
  const statsMap = new Map(
    getCategoryStats(sessions).map((s) => [s.category, s]),
  )
  const todayTotal = getTodayTotalSeconds(sessions)

  return (
    <TechPanel>
      <TechSectionTitle>分类汇总</TechSectionTitle>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {DEFAULT_CATEGORIES.map((cat) => {
          const stat = statsMap.get(cat.name)
          const seconds = stat?.totalSeconds ?? 0
          const count = stat?.taskCount ?? 0
          const pct = todayTotal > 0 ? (seconds / todayTotal) * 100 : 0

          return (
            <article
              key={cat.id}
              className="tech-category-card relative overflow-hidden p-4"
            >
              <div
                className="pointer-events-none absolute right-0 top-0 h-16 w-16 opacity-20"
                style={{
                  background: `radial-gradient(circle at top right, ${cat.color}, transparent 70%)`,
                }}
              />
              <h3 className="relative font-mono text-xs uppercase tracking-wider text-slate-300">
                {cat.name}
              </h3>
              <p
                className="relative mt-3 font-mono text-xl font-bold"
                style={{ color: cat.color, textShadow: `0 0 16px ${cat.color}55` }}
              >
                {formatDuration(seconds)}
              </p>
              <p className="relative mt-1 font-mono text-[10px] text-slate-500">
                {count} TASKS
              </p>
              <p className="relative mt-2 font-mono text-[10px] text-cyan-500/50">
                {pct.toFixed(1)}% OF TODAY
              </p>
              <div className="tech-progress-track relative mt-3">
                <div
                  className="h-full rounded-sm"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${cat.color}, ${cat.color}88)`,
                    boxShadow: `0 0 8px ${cat.color}66`,
                  }}
                />
              </div>
            </article>
          )
        })}
      </div>
    </TechPanel>
  )
}
