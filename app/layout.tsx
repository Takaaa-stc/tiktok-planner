import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'StudyPrint AI - AI解説プリント生成',
  description:
    '問題画像をアップロードするだけで、途中式・解説・重要ポイント・類題を含む学習プリントを自動生成。復習・テスト前の見直しに最適。',
  keywords: '学習プリント, AI解説, 問題解説, 途中式, 復習, テスト対策',
  openGraph: {
    title: 'StudyPrint AI',
    description: 'AIが"理解できる解説プリント"を作る',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#111827',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            },
          }}
        />
      </body>
    </html>
  )
}
