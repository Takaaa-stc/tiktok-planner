'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Upload,
  Camera,
  X,
  Loader2,
  FileText,
  Lightbulb,
  BookOpen,
  Target,
  Repeat,
  ChevronRight,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { type GenerationMode, MODE_LABELS } from '@/types'
import { cn } from '@/lib/utils'

const modes: { value: GenerationMode; icon: typeof FileText; description: string }[] = [
  { value: 'simple', icon: FileText, description: '基本的な解答と解説' },
  { value: 'detailed', icon: Lightbulb, description: '途中式・考え方を詳しく解説' },
  { value: 'review', icon: BookOpen, description: '復習に最適なプリント形式' },
  { value: 'test_prep', icon: Target, description: 'テスト対策に特化した解説' },
  { value: 'similar_questions', icon: Repeat, description: '類題も自動生成（プロプランのみ）' },
]

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [mode, setMode] = useState<GenerationMode>('detailed')
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) {
      toast.error('画像ファイルを選択してください')
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error('ファイルサイズは10MB以下にしてください')
      return
    }
    setFile(f)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(f)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) handleFile(dropped)
  }, [])

  const handleSubmit = async () => {
    if (!file) {
      toast.error('画像を選択してください')
      return
    }
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('mode', mode)

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '生成に失敗しました')
      }

      toast.success('解説プリントを生成しました！')
      router.push(`/result/${data.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '生成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">解説プリントを生成</h1>
        <p className="text-gray-500 text-sm mt-1">問題画像をアップロードして、AIに解説プリントを作らせましょう</p>
      </div>

      {/* Upload area */}
      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-600" />
          問題画像
        </h2>

        {!preview ? (
          <div
            className={cn(
              'border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all',
              dragOver
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            )}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="font-medium text-gray-700 mb-1">クリックまたはドラッグして画像をアップロード</p>
            <p className="text-sm text-gray-500">JPG, PNG, WebP / 最大10MB</p>
            <p className="text-xs text-gray-400 mt-3">教科書・プリント・ノートの写真でOK</p>
          </div>
        ) : (
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden bg-gray-100 max-h-80">
              <Image
                src={preview}
                alt="アップロード画像"
                width={800}
                height={600}
                className="w-full h-auto max-h-80 object-contain"
              />
            </div>
            <button
              onClick={() => { setFile(null); setPreview(null) }}
              className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-sm text-gray-500 mt-2">{file?.name} ({Math.round((file?.size ?? 0) / 1024)}KB)</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
          }}
        />
      </div>

      {/* Mode selection */}
      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          出力モード
        </h2>
        <div className="space-y-2">
          {modes.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
                mode === m.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                mode === m.value ? 'bg-blue-600' : 'bg-gray-100'
              )}>
                <m.icon className={cn('w-5 h-5', mode === m.value ? 'text-white' : 'text-gray-500')} />
              </div>
              <div>
                <p className={cn('font-semibold text-sm', mode === m.value ? 'text-blue-700' : 'text-gray-800')}>
                  {MODE_LABELS[m.value]}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{m.description}</p>
              </div>
              {mode === m.value && (
                <ChevronRight className="w-5 h-5 text-blue-600 ml-auto" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-xs font-semibold text-amber-800 mb-2">📷 きれいに読み取るコツ</p>
        <ul className="text-xs text-amber-700 space-y-1">
          <li>• 明るい場所で撮影する</li>
          <li>• 問題全体が収まるように撮影する</li>
          <li>• 文字がぼけないようにピントを合わせる</li>
          <li>• 斜めにならないように正面から撮影する</li>
        </ul>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!file || loading}
        className="btn-primary w-full py-4 text-base rounded-xl"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
            AIが解析中... しばらくお待ちください
          </>
        ) : (
          <>
            <Loader2 className="w-5 h-5 mr-2 hidden" />
            解説プリントを生成する
          </>
        )}
      </button>
      <p className="text-center text-xs text-gray-400 mt-3">
        本サービスは学習補助を目的としています。テスト中の利用はご遠慮ください。
      </p>
    </div>
  )
}
