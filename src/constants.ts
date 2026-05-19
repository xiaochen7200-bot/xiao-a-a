import type { Category } from './types'

/** 默认工作分类及展示颜色 */
export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: '视频剪辑', color: '#3b82f6' },
  { id: '2', name: '爆款拆解', color: '#06b6d4' },
  { id: '3', name: 'AI工具测试', color: '#8b5cf6' },
  { id: '4', name: 'Prompt测试', color: '#a855f7' },
  { id: '5', name: '产品设计', color: '#6366f1' },
  { id: '6', name: '客户沟通', color: '#14b8a6' },
  { id: '7', name: '素材拍摄', color: '#22c55e' },
  { id: '8', name: '数据复盘', color: '#eab308' },
  { id: '9', name: '团队管理', color: '#f97316' },
  { id: '10', name: '学习训练', color: '#ec4899' },
  { id: '11', name: '其他', color: '#64748b' },
]

export const STORAGE_KEYS = {
  sessions: 'ai-factory-sessions',
  active: 'ai-factory-active-session',
} as const
