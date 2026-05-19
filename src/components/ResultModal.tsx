import { useEffect, useState, type FormEvent } from 'react'

interface ResultModalProps {
  open: boolean
  title: string
  category: string
  durationLabel: string
  onCancel: () => void
  onSave: (result: string, note: string) => void
}

const EXAMPLES = [
  '发了7条视频',
  '拆解3条爆款',
  '测试2个AI工具',
  '成交1单',
  '客户已加微信',
  '完播率35%',
  '无流量',
  '测试失败',
]

export default function ResultModal({
  open,
  title,
  category,
  durationLabel,
  onCancel,
  onSave,
}: ResultModalProps) {
  const [result, setResult] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setResult('')
      setNote('')
      setError('')
    }
  }, [open])

  if (!open) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!result.trim()) {
      setError('请填写产出结果')
      return
    }
    onSave(result.trim(), note.trim())
  }

  return (
    <div
      className="tech-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="result-modal-title"
    >
      <div className="tech-modal tech-panel relative w-full max-w-lg p-6">
        <span className="tech-corner tech-corner-tl" aria-hidden />
        <span className="tech-corner tech-corner-tr" aria-hidden />
        <span className="tech-corner tech-corner-bl" aria-hidden />
        <span className="tech-corner tech-corner-br" aria-hidden />

        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-500">
          TASK COMPLETE
        </p>
        <h2
          id="result-modal-title"
          className="tech-title mt-1 text-xl font-bold"
        >
          填写产出结果
        </h2>
        <p className="mt-2 font-mono text-xs text-slate-400">
          {title} · {category} · {durationLabel}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="tech-label">
              产出结果 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={result}
              onChange={(e) => {
                setResult(e.target.value)
                setError('')
              }}
              rows={3}
              placeholder="例如：发了7条视频、成交1单..."
              className="tech-textarea"
            />
            {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
            <div className="mt-2 flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setResult(ex)}
                  className="tech-chip"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="tech-label">备注（可选）</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="补充说明..."
              className="tech-textarea"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="tech-btn tech-btn-ghost px-5 py-2.5"
            >
              取消
            </button>
            <button type="submit" className="tech-btn tech-btn-primary px-5 py-2.5">
              保存记录
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
