'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      toast.error('パスワードは8文字以上で入力してください')
      return
    }
    setLoading(true)

    const redirectUrl = `${window.location.origin}/auth/callback${plan ? `?plan=${plan}` : ''}`

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <div className="card p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">確認メールを送りました</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          <strong>{email}</strong> に確認メールを送りました。
          メール内のリンクをクリックして、登録を完了させてください。
        </p>
        <p className="text-gray-500 text-xs mt-4">
          メールが届かない場合は、迷惑メールフォルダをご確認ください。
        </p>
      </div>
    )
  }

  return (
    <div className="card p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">新規登録</h1>
      <p className="text-gray-600 text-sm mb-8">
        無料アカウントを作成して、AI解説プリントを試してみましょう。
        {plan && (
          <span className="ml-1 text-blue-600 font-medium">
            {plan === 'pro' ? 'プロプラン' : 'ライトプラン'}登録後に課金手続きへ進みます。
          </span>
        )}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label" htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="your@email.com"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="label" htmlFor="password">パスワード（8文字以上）</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pr-12"
              placeholder="8文字以上のパスワード"
              required
              minLength={8}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500 -mt-2">
          登録することで、
          <Link href="/legal/terms" className="text-blue-600 hover:underline">利用規約</Link>
          と
          <Link href="/legal/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</Link>
          に同意したことになります。
        </p>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              登録中...
            </>
          ) : '無料で登録する'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          すでにアカウントをお持ちの方は{' '}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            ログイン
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <div className="w-full max-w-md">
      <Suspense fallback={<div className="card p-8 text-center text-gray-500">読み込み中...</div>}>
        <SignupForm />
      </Suspense>
    </div>
  )
}
