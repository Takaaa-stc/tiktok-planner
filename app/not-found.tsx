import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-black text-gray-200 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">ページが見つかりません</h2>
      <p className="text-gray-600 mb-8">お探しのページは存在しないか、移動された可能性があります。</p>
      <Link href="/" className="btn-primary">
        トップページへ戻る
      </Link>
    </div>
  )
}
