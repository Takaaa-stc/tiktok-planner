import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  Plus,
  Zap,
  Clock,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Crown,
} from 'lucide-react'
import { PLAN_LABELS, MODE_LABELS, type Plan, type Generation } from '@/types'
import { formatDateShort } from '@/lib/utils'

async function getDailyUsage(userId: string, supabase: Awaited<ReturnType<typeof createClient>>) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { count } = await supabase
    .from('generations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', today.toISOString())

  return count ?? 0
}

const DAILY_LIMITS: Record<Plan, number> = {
  free: 3,
  light: 50,
  pro: 200,
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileResult, generationsResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('generations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const profile = profileResult.data
  const recentGenerations = (generationsResult.data ?? []) as Generation[]
  const plan = (profile?.plan ?? 'free') as Plan
  const dailyUsage = await getDailyUsage(user.id, supabase)
  const dailyLimit = DAILY_LIMITS[plan]
  const remaining = Math.max(0, dailyLimit - dailyUsage)
  const usagePercent = Math.min(100, (dailyUsage / dailyLimit) * 100)

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-500 text-sm mt-1">解説プリントを生成して学習を効率化しましょう</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">今日の残り回数</span>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-black text-gray-900">{remaining}</span>
            <span className="text-gray-500 text-sm mb-1">/ {dailyLimit} 回</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">現在のプラン</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{PLAN_LABELS[plan]}</p>
          {plan === 'free' && (
            <Link href="/pricing" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
              アップグレードする →
            </Link>
          )}
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">累計生成数</span>
          </div>
          <p className="text-3xl font-black text-gray-900">{profile?.generation_count ?? 0}</p>
          <p className="text-gray-500 text-xs mt-1">通算プリント生成回数</p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-8 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1">解説プリントを生成する</h2>
            <p className="text-blue-100 text-sm">問題画像をアップロードするだけ。AIが理解できる解説を作ります。</p>
          </div>
          <Link
            href="/upload"
            className="flex items-center gap-2 bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            新しく生成
          </Link>
        </div>
      </div>

      {/* Recent generations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            最近の生成履歴
          </h2>
          <Link href="/history" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            すべて見る
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentGenerations.length === 0 ? (
          <div className="card p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">まだ生成履歴がありません</p>
            <p className="text-gray-400 text-sm mt-1">問題画像をアップロードして、最初の解説プリントを作りましょう</p>
            <Link href="/upload" className="btn-primary mt-6 text-sm inline-flex">
              <Plus className="w-4 h-4 mr-2" />
              生成する
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentGenerations.map((gen) => (
              <Link
                key={gen.id}
                href={`/result/${gen.id}`}
                className="card p-4 flex items-center gap-4 hover:border-blue-200 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{gen.title || '無題'}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">{gen.subject || '不明'}</span>
                    {gen.unit && <span className="text-xs text-gray-400">/ {gen.unit}</span>}
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {MODE_LABELS[gen.mode as keyof typeof MODE_LABELS] || gen.mode}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs text-gray-400">{formatDateShort(gen.created_at)}</span>
                  <ArrowRight className="w-4 h-4 text-gray-300 mt-1 ml-auto" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Upgrade CTA for free users */}
      {plan === 'free' && (
        <div className="mt-8 card p-6 border-2 border-dashed border-gray-200 text-center">
          <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">プロプランにアップグレード</h3>
          <p className="text-gray-600 text-sm mb-4">
            月200回生成・PDF保存・類題生成・テスト対策モードが使えます
          </p>
          <Link href="/pricing" className="btn-primary text-sm inline-flex">
            プランを見る
          </Link>
        </div>
      )}
    </div>
  )
}
