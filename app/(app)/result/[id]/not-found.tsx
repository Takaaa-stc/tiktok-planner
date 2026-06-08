import Link from 'next/link'
import { FileX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <FileX className="w-16 h-16 text-gray-300 mb-4" />
      <h2 className="text-xl font-bold text-gray-900 mb-2">プリントが見つかりません</h2>
      <p className="text-gray-500 text-sm mb-6">
        このURLのプリントは存在しないか、アクセス権限がありません。
      </p>
      <Link href="/history" className="btn-primary text-sm">
        生成履歴を確認する
      </Link>
    </div>
  )
}
