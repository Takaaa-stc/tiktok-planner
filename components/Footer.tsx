import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg">StudyPrint AI</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              問題画像から"理解できる解説プリント"を自動生成。
              復習・テスト前の見直しに最適なAI学習補助ツール。
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">サービス</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#features" className="hover:text-white transition-colors">機能</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">料金</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">料金詳細</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">サポート</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/legal/terms" className="hover:text-white transition-colors">利用規約</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-white transition-colors">プライバシーポリシー</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">© 2025 StudyPrint AI. All rights reserved.</p>
          <p className="text-xs">
            本サービスは学習補助を目的としています。
          </p>
        </div>
      </div>
    </footer>
  )
}
