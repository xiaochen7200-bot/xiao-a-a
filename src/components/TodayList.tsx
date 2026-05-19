import type { WorkSession } from '../types'
import { DEFAULT_CATEGORIES } from '../constants'
import { formatDuration, formatTimeRange } from '../utils/time'
import { TechPanel, TechSectionTitle } from './ui/TechPanel'

interface TodayListProps {
  sessions: WorkSession[]
  onDelete: (id: string) => void
}

function getCategoryColor(name: string): string {
  return DEFAULT_CATEGORIES.find((c) => c.name === name)?.color ?? '#64748b'
}

export default function TodayList({ sessions, onDelete }: TodayListProps) {
  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`确定删除「${title}」这条记录吗？`)) {
      onDelete(id)
    }
  }

  return (
    <TechPanel>
      <TechSectionTitle suffix={`${sessions.length} LOGS`}>今日工作记录</TechSectionTitle>

      {sessions.length === 0 ? (
        <p className="py-16 text-center font-mono text-xs tracking-widest text-slate-500">
          NO DATA · 开始计时以创建记录
        </p>
      ) : (
        <ul className="tech-scroll max-h-[520px] space-y-3 overflow-y-auto pr-1">
          {sessions.map((s) => {
            const color = getCategoryColor(s.category)
            return (
              <li key={s.id} className="tech-card p-4">
                <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-[10px] tracking-wider text-cyan-500/60">
                      {formatTimeRange(s.startTime, s.endTime)}
                    </p>
                    <h3 className="mt-1 font-medium text-white">{s.title}</h3>
                  </div>
                  <span
                    className="tech-tag"
                    style={{ color, borderColor: `${color}88` }}
                  >
                    {s.category}
                  </span>
                </div>

                <p className="tech-stat-value mt-2 text-lg">
                  {formatDuration(s.durationSeconds)}
                </p>

                <p className="mt-3 border-t border-cyan-500/10 pt-3 text-sm text-slate-300">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-500/50">
                    OUTPUT ·{' '}
                  </span>
                  {s.result}
                </p>
                {s.note && (
                  <p className="mt-2 text-sm text-slate-500">
                    <span className="font-mono text-[10px] text-slate-600">NOTE · </span>
                    {s.note}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => handleDelete(s.id, s.title)}
                  className="tech-btn-danger-text mt-3"
                >
                  DELETE
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </TechPanel>
  )
}
