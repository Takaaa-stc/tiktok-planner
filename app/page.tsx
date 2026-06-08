import Link from 'next/link'
import {
  Camera,
  FileText,
  Brain,
  Download,
  CheckCircle,
  XCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Target,
  Repeat,
  Clock,
  Shield,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const features = [
  {
    icon: Camera,
    title: '画像アップロード',
    description: '問題の写真を撮って送るだけ。スキャン画像・教科書・プリントどれでもOK。',
  },
  {
    icon: Brain,
    title: 'AI問題読み取り',
    description: 'AIが問題文を正確に読み取り、教科・単元を自動判別します。',
  },
  {
    icon: FileText,
    title: '解説プリント生成',
    description: '途中式・考え方・重要ポイント・よくあるミスを含む整った解説プリントを生成。',
  },
  {
    icon: Download,
    title: 'PDF保存',
    description: '生成した解説プリントをPDF形式で保存。テスト前の見直しに活用できます。',
  },
  {
    icon: Repeat,
    title: '類題生成',
    description: '同じ単元の類題を自動生成。理解を深めるための練習問題として活用できます。',
  },
  {
    icon: Target,
    title: 'テスト対策モード',
    description: '出題頻度の高い問題パターンや、重要な公式・定理を重点的に解説します。',
  },
]

const comparisonItems = [
  {
    feature: 'プロンプト入力',
    normal: '毎回必要',
    studyprint: '写真を送るだけ',
  },
  {
    feature: '出力形式',
    normal: '毎回バラバラ',
    studyprint: '毎回プリント形式',
  },
  {
    feature: '解説の質',
    normal: '答えだけになりやすい',
    studyprint: '途中式と考え方まで整理',
  },
  {
    feature: 'PDF保存',
    normal: 'できない',
    studyprint: 'できる',
  },
  {
    feature: '復習のしやすさ',
    normal: '復習に使いにくい',
    studyprint: 'テスト前に見返しやすい',
  },
]

const problems = [
  '毎回プロンプトを考えるのが面倒',
  '答えは出ても、途中式が分かりにくい',
  '回答形式が毎回バラバラ',
  'スクショしても復習しにくい',
  'PDFやプリントとして残しにくい',
  'テスト前に見返しづらい',
]

const outputs = [
  '読み取った問題文',
  '解答',
  '途中式（ステップごとに丁寧に）',
  '考え方・解説',
  '重要ポイント',
  'よくあるミス',
  '類題（プロプラン）',
  'PDF保存',
]

const plans = [
  {
    name: '無料プラン',
    price: '¥0',
    period: '',
    description: 'まずは試してみたい方へ',
    features: [
      '1日3回まで生成',
      '基本解説',
      '透かしあり',
      '生成履歴（3件）',
    ],
    unavailable: ['PDF保存', '類題生成', 'テスト対策モード'],
    cta: '無料で始める',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'ライトプラン',
    price: '¥980',
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
    cta: '今すぐ始める',
    href: '/signup?plan=light',
    highlighted: false,
  },
  {
    name: 'プロプラン',
    price: '¥1,980',
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
    cta: 'プロプランで始める',
    href: '/signup?plan=pro',
    highlighted: true,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-2 rounded-full mb-8">
            <Sparkles className="w-4 h-4" />
            AI学習補助ツール
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            写真を送るだけ。
            <br />
            <span className="text-blue-600">AIが"理解できる</span>
            <br />
            <span className="text-blue-600">解説プリント"を作る。</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            普通にAIへ聞くより、見やすく、復習しやすく、途中式までわかる。
            <br className="hidden sm:block" />
            問題画像から、解答・解説・重要ポイント・類題を1枚の学習プリントに自動整理します。
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto btn-primary text-base px-8 py-4 rounded-xl shadow-lg shadow-blue-200"
            >
              無料で試す
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="#sample"
              className="w-full sm:w-auto btn-outline text-base px-8 py-4 rounded-xl"
            >
              サンプルを見る
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            クレジットカード不要・1日3回まで無料
          </p>
        </div>

        {/* Hero image placeholder - sample print preview */}
        <div className="max-w-3xl mx-auto mt-16" id="sample">
          <div className="card p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">数学 / 二次方程式</p>
                <h3 className="font-bold text-gray-900">二次方程式の解き方（因数分解）</h3>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-blue-700 mb-1">読み取った問題</p>
                <p className="text-gray-800">x² + 5x + 6 = 0 を解け</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-green-700 mb-1">答え</p>
                <p className="text-gray-800 font-mono">x = -2, -3</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">途中式</p>
                <div className="space-y-2">
                  {[
                    { step: 'STEP 1', content: '積が6、和が5になる2数を探す', formula: '2 × 3 = 6, 2 + 3 = 5' },
                    { step: 'STEP 2', content: '因数分解する', formula: '(x + 2)(x + 3) = 0' },
                    { step: 'STEP 3', content: '各因数を0とおく', formula: 'x + 2 = 0 または x + 3 = 0' },
                  ].map((s) => (
                    <div key={s.step} className="flex gap-3 text-sm">
                      <span className="text-blue-600 font-semibold whitespace-nowrap">{s.step}</span>
                      <div>
                        <p className="text-gray-600">{s.content}</p>
                        <p className="font-mono text-gray-800">{s.formula}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-medium">重要ポイント: 積と和に注目</span>
                <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full font-medium">よくあるミス: 符号の間違い</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">普通のAIチャットでは、<br />こんな悩みがありませんか？</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {problems.map((problem, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-200">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 text-sm">{problem}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">
              StudyPrint AIなら、<br />
              <span className="text-blue-600">問題画像をアップするだけ</span>
            </h2>
            <p className="section-subtitle">
              学習用に整った解説プリントを自動生成します
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {outputs.map((output, i) => (
              <div key={i} className="flex items-center gap-3 bg-blue-50 rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <p className="text-gray-800 font-medium text-sm">{output}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">普通のAIチャットとの違い</h2>
          </div>
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-4 text-sm font-semibold text-gray-700 w-1/3">比較項目</th>
                  <th className="text-center p-4 text-sm font-semibold text-gray-500 w-1/3">普通のAIチャット</th>
                  <th className="text-center p-4 text-sm font-semibold text-blue-600 w-1/3 bg-blue-50">StudyPrint AI</th>
                </tr>
              </thead>
              <tbody>
                {comparisonItems.map((item, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0">
                    <td className="p-4 text-sm font-medium text-gray-700">{item.feature}</td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 text-gray-500 text-sm">
                        <XCircle className="w-4 h-4 text-red-400" />
                        {item.normal}
                      </span>
                    </td>
                    <td className="p-4 text-center bg-blue-50/50">
                      <span className="inline-flex items-center gap-1 text-blue-700 text-sm font-medium">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        {item.studyprint}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">主な機能</h2>
            <p className="section-subtitle">学習に最適化されたAIツールをすべて搭載</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="card p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">使い方は簡単3ステップ</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: '問題画像をアップロード', desc: '教科書・プリント・ノートの写真を送るだけ' },
              { step: '02', title: 'モードを選択', desc: 'シンプル解説から類題生成まで、目的に合わせて選択' },
              { step: '03', title: '解説プリントを確認・保存', desc: 'AIが生成した解説プリントを確認し、PDFで保存' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white text-2xl font-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" id="pricing">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">シンプルな料金プラン</h2>
            <p className="section-subtitle">すべてのプランで、解説プリントの自動生成が使えます</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`card p-6 relative ${plan.highlighted ? 'border-2 border-blue-600 shadow-lg shadow-blue-100' : ''}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    人気No.1
                  </div>
                )}
                <h3 className="font-bold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-black text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                  {plan.unavailable.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                      <XCircle className="w-4 h-4 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center rounded-lg py-3 text-sm font-semibold transition-colors ${
                    plan.highlighted
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-blue-200" />
            <Clock className="w-8 h-8 text-blue-200" />
            <BookOpen className="w-8 h-8 text-blue-200" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            学習補助を目的とした<br />安心・安全なサービス
          </h2>
          <p className="text-blue-100 leading-relaxed mb-8">
            StudyPrint AIは「答えを出すAI」ではなく、「理解できる解説プリントを作るAI」です。
            途中式・考え方・重要ポイントを含む解説で、本当の理解を促します。
            テスト中の利用ではなく、復習・学習補助としての活用を推奨しています。
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors"
          >
            無料で始める
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
