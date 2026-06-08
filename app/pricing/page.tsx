import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CheckCircle, XCircle, Crown, Zap } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import UpgradeButton from '@/components/app/UpgradeButton'

const plans = [
  {
    id: 'free' as const,
    name: '無料プラン',
    price: 0,
    period: '',
    description: 'まずは試してみたい方へ',
    features: [
      '1日3回まで生成',
      '基本解説',
      '生成履歴（3件）',
    ],
    unavailable: ['PDF保存', '透かしなし', '類題生成', 'テスト対策モード'],
    highlighted: false,
    badge: null,
  },
  {
    id: 'light' as const,
    name: 'ライトプラン',
    price: 980,
    period: '/月',
    description: '定期的に使いたい方へ',
    features: [
      '月50回生成',
      '詳細解説',
      '透かしなし',
      'PDF保存',
      '生成履歴（全件）',
    ],
    unavailable: ['類題生成', 'テスト対策モード'],
    highlighted: false,
    badge: null,
  },
  {
    id: 'pro' as const,
    name: 'プロプラン',
    price: 1980,
    period: '/月',
    description: '本格的に学習したい方へ',
    features: [
      '月200回生成',
      '詳細解説',
      '透かしなし',
      'PDF保存',
      '類題生成',
      'テスト対策モード',
      '複数ページ対応',
      '優先サポート',
    ],
    unavailable: [],
    highlighted: true,
    badge: '人気No.1',
  },
]

export default async function PricingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let currentPlan = 'free'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single()
    currentPlan = profile?.plan ?? 'free'
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar isLoggedIn={!!user} />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              シンプルな料金プラン
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              すべてのプランで、AIによる解説プリント生成が使えます。
              いつでもアップグレード・ダウングレード可能です。
            </p>
          </div>

          {/* Current plan indicator */}
          {user && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-center">
              <p className="text-blue-700 text-sm">
                現在のプラン:{' '}
                <strong>
                  {plans.find((p) => p.id === currentPlan)?.name ?? '無料プラン'}
                </strong>
              </p>
            </div>
          )}

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 p-6 flex flex-col ${
                  plan.highlighted
                    ? 'border-blue-600 shadow-xl shadow-blue-100'
                    : 'border-gray-200'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    {plan.id === 'pro' && <Crown className="w-5 h-5 text-yellow-500" />}
                    {plan.id === 'light' && <Zap className="w-5 h-5 text-blue-500" />}
                    <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
                  </div>
                  <p className="text-gray-500 text-sm">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-gray-900">
                    {plan.price === 0 ? '¥0' : `¥${plan.price.toLocaleString()}`}
                  </span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                  {plan.unavailable.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-400">
                      <XCircle className="w-4 h-4 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {plan.id === 'free' ? (
                  <Link
                    href={user ? '/dashboard' : '/signup'}
                    className={`block text-center rounded-xl py-3 text-sm font-bold transition-colors ${
                      currentPlan === 'free'
                        ? 'bg-gray-100 text-gray-500 cursor-default'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {currentPlan === 'free' ? '現在のプラン' : '無料で始める'}
                  </Link>
                ) : currentPlan === plan.id ? (
                  <div className="block text-center rounded-xl py-3 text-sm font-bold bg-green-100 text-green-700">
                    現在のプラン
                  </div>
                ) : user ? (
                  <UpgradeButton planId={plan.id} highlighted={plan.highlighted} />
                ) : (
                  <Link
                    href={`/signup?plan=${plan.id}`}
                    className={`block text-center rounded-xl py-3 text-sm font-bold transition-colors ${
                      plan.highlighted
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    今すぐ始める
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">よくある質問</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'いつでもキャンセルできますか？',
                  a: 'はい、いつでもキャンセルできます。キャンセル後も、当月末まで有料プランの機能を利用できます。',
                },
                {
                  q: '無料プランから始められますか？',
                  a: 'はい、クレジットカード不要で無料プランをご利用いただけます。1日3回まで解説プリントを生成できます。',
                },
                {
                  q: '対応している科目を教えてください。',
                  a: '数学・英語・理科（物理・化学・生物）・社会（地理・歴史・公民）などに対応しています。AIが画像から教科を自動判別します。',
                },
                {
                  q: '生成した解説プリントは保存できますか？',
                  a: 'ライトプラン・プロプランでPDF保存が可能です。生成履歴は全プランで確認できます（無料プランは直近3件）。',
                },
              ].map((faq) => (
                <div key={faq.q} className="card p-5">
                  <h3 className="font-semibold text-gray-900 mb-2">Q. {faq.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">A. {faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
