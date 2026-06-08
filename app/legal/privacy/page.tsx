import Link from 'next/link'
import { BookOpen, ArrowLeft } from 'lucide-react'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">プライバシーポリシー</h1>
        <p className="text-gray-500 text-sm mb-8">最終更新日: 2025年6月1日</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. 収集する情報</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              本サービスでは以下の情報を収集します。
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>メールアドレス（アカウント登録時）</li>
              <li>アップロードされた問題画像</li>
              <li>AI生成結果データ</li>
              <li>利用ログ（生成回数・利用日時等）</li>
              <li>決済情報（Stripeが管理・当社は保持しません）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. 情報の利用目的</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>本サービスの提供・改善</li>
              <li>ユーザーへのサポート対応</li>
              <li>不正利用の防止</li>
              <li>AI機能の品質向上（個人識別できない形での集計分析）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. 第三者への提供</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              当社は以下の場合を除き、個人情報を第三者へ提供しません。
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>法令に基づく場合</li>
              <li>サービス運営に必要な委託先（Supabase、Stripe、OpenAI等）への提供</li>
            </ul>
            <p className="text-gray-600 text-sm mt-3">
              ※ OpenAI APIへの画像送信時、OpenAIのプライバシーポリシーが適用されます。
              アップロードした画像データはAI解析に使用されます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. データの保管・削除</h2>
            <p className="text-gray-600 leading-relaxed">
              アップロードした画像・生成結果はSupabaseのセキュアなストレージに保存されます。
              アカウント削除時は、関連するすべてのデータを削除します。
              お問い合わせによりデータ削除をリクエストできます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Cookie・アナリティクス</h2>
            <p className="text-gray-600 leading-relaxed">
              本サービスでは認証・セッション管理のためにCookieを使用します。
              サービス改善のために匿名の利用統計を収集する場合があります。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. お問い合わせ</h2>
            <p className="text-gray-600 leading-relaxed">
              プライバシーに関するご質問・ご要望は、サービス内のお問い合わせフォームよりご連絡ください。
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
