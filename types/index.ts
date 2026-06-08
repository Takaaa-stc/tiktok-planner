export type Plan = 'free' | 'light' | 'pro'

export type GenerationMode =
  | 'simple'
  | 'detailed'
  | 'review'
  | 'test_prep'
  | 'similar_questions'

export interface Profile {
  id: string
  email: string
  plan: Plan
  generation_count: number
  created_at: string
}

export interface Step {
  title: string
  formula: string
  explanation: string
}

export interface SimilarQuestion {
  question: string
  answer: string
  explanation: string
}

export interface AIResult {
  subject: string
  unit: string
  title: string
  detected_problem: string
  answer: string
  steps: Step[]
  key_points: string[]
  common_mistakes: string[]
  similar_questions: SimilarQuestion[]
  summary: string
}

export interface Generation {
  id: string
  user_id: string
  image_url: string
  subject: string
  unit: string
  title: string
  mode: GenerationMode
  ai_result: AIResult
  pdf_url: string | null
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  plan: Plan
  status: string
  current_period_end: string
  created_at: string
}

export const PLAN_LIMITS: Record<Plan, { daily: number; monthly: number }> = {
  free: { daily: 3, monthly: 90 },
  light: { daily: 50, monthly: 50 },
  pro: { daily: 200, monthly: 200 },
}

export const PLAN_LABELS: Record<Plan, string> = {
  free: '無料プラン',
  light: 'ライトプラン',
  pro: 'プロプラン',
}

export const MODE_LABELS: Record<GenerationMode, string> = {
  simple: 'シンプル解説',
  detailed: '詳細解説',
  review: '復習プリント',
  test_prep: 'テスト対策',
  similar_questions: '類題生成',
}
