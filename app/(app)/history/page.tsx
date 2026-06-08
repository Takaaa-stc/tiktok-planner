import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BookOpen, ArrowRight, FileText, Search } from 'lucide-react'
import { type Generation, MODE_LABELS } from '@/types'
import { formatDate } from '@/lib/utils'

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: generations } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100)

  const items = (generations ?? []) as Generation[]

  const subjectGroups = items.reduce((acc, gen) => {
    const subject = gen.subject || 'その他'
    if (!acc[subject]) acc[subject] = []
    acc[subject].push(gen)
    return acc
  }, {} as Record<string, Generation[]>)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">生成履歴</h1>
        <p className="text-gray-500 text-sm mt-1">過去に生成した解説プリントを確認できます</p>
      </div>

      {items.length === 0 ? (
        <div className="card p-16 text-center">
          <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="font-semibold text-gray-600 mb-2">生成履歴がありません</p>
          <p className="text-gray-400 text-sm mb-6">問題画像をアップロードして、最初の解説プリントを作りましょう</p>
          <Link href="/upload" className="btn-primary text-sm inline-flex">
            今すぐ生成する
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="card p-4 text-center">
              <p className="text-2xl font-black text-gray-900">{items.length}</p>
              <p className="text-xs text-gray-500 mt-1">累計生成数</p>
            </div>
            {Object.entries(subjectGroups).slice(0, 3).map(([subject, gens]) => (
              <div key={subject} className="card p-4 text-center">
                <p className="text-2xl font-black text-blue-600">{gens.length}</p>
                <p className="text-xs text-gray-500 mt-1">{subject}</p>
              </div>
            ))}
          </div>

          {/* List */}
          <div className="space-y-3">
            {items.map((gen) => (
              <Link
                key={gen.id}
                href={`/result/${gen.id}`}
                className="card p-4 flex items-center gap-4 hover:border-blue-200 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                    {gen.title || '無題'}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {gen.subject || '不明'}
                    </span>
                    {gen.unit && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {gen.unit}
                      </span>
                    )}
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {MODE_LABELS[gen.mode as keyof typeof MODE_LABELS] || gen.mode}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(gen.created_at)}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
