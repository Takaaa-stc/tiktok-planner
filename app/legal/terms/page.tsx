import Link from 'next/link'
import { BookOpen, ArrowLeft } from 'lucide-react'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">StudyPrint AI</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            トップへ戻る
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">利用規約</h1>
        <p className="text-gray-500 text-sm mb-8">最終更新日: 2025年6月1日</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第1条（適用）</h2>
            <p className="text-gray-600 leading-relaxed">
              本利用規約（以下「本規約」）は、StudyPrint AI（以下「本サービス」）の利用に関する条件を定めるものです。
              ユーザーは本規約に同意した上で本サービスを利用するものとします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第2条（サービスの目的）</h2>
            <p className="text-gray-600 leading-relaxed">
              本サービスは、学習の補助を目的としたAI解説プリント生成ツールです。
              ユーザーが問題画像をアップロードすることで、AIが途中式・解説・重要ポイントを含む学習プリントを生成します。
              本サービスは「復習」「学習理解の深化」を目的としており、テスト中の不正利用を目的とした利用を禁止します。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第3条（禁止事項）</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              ユーザーは以下の行為を行ってはなりません。
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>テスト・試験中における本サービスの利用</li>
              <li>法令または公序良俗に違反する行為</li>
              <li>本サービスの不正利用・不正アクセス</li>
              <li>他のユーザーへの迷惑行為</li>
              <li>本サービスの逆コンパイル・リバースエンジニアリング</li>
              <li>商業目的での無断転用</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第4条（料金・決済）</h2>
            <p className="text-gray-600 leading-relaxed">
              有料プランの料金は月額制です。支払いはStripeを通じて処理されます。
              サブスクリプションはいつでもキャンセルできますが、当月分の返金は行いません。
              キャンセル後も当月末日まで有料プランの機能を利用できます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第5条（免責事項）</h2>
            <p className="text-gray-600 leading-relaxed">
              本サービスのAI生成結果は補助的な学習ツールです。
              生成内容の正確性を100%保証するものではありません。
              最終的な学習判断はユーザー自身の責任で行ってください。
              本サービスの利用により生じた損害について、当社は責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第6条（サービスの変更・終了）</h2>
            <p className="text-gray-600 leading-relaxed">
              当社は、ユーザーへの事前通知なく本サービスの内容を変更・終了できるものとします。
              サービス終了の場合は、可能な限り事前にユーザーへ通知します。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第7条（準拠法・管轄）</h2>
            <p className="text-gray-600 leading-relaxed">
              本規約は日本法に準拠します。本サービスに関する紛争は、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
