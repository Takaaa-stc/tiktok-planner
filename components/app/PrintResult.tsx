'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  Plus,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Share2,
  Loader2,
  Crown,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { type Generation, type AIResult, type Plan, MODE_LABELS } from '@/types'
import { formatDate } from '@/lib/utils'

interface Props {
  generation: Generation
  plan: string
}

export default function PrintResult({ generation, plan }: Props) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const result = generation.ai_result as AIResult
  const isPaidPlan = plan === 'light' || plan === 'pro'

  async function handleDownloadPDF() {
    setPdfLoading(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const { default: jsPDF } = await import('jspdf')

      const element = printRef.current
      if (!element) return

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * (96 / 72)
      const scaledWidth = imgWidth * ratio
      const scaledHeight = imgHeight * ratio

      const x = (pdfWidth - scaledWidth) / 2
      let y = 0
      let remainingHeight = scaledHeight

      while (remainingHeight > 0) {
        if (y > 0) pdf.addPage()
        pdf.addImage(
          imgData,
          'PNG',
          x,
          -y,
          scaledWidth,
          scaledHeight
        )
        y += pdfHeight
        remainingHeight -= pdfHeight
      }

      const filename = `studyprint_${result.subject || 'problem'}_${Date.now()}.pdf`
      pdf.save(filename)
      toast.success('PDFを保存しました')
    } catch (err) {
      console.error(err)
      toast.error('PDF生成に失敗しました')
    } finally {
      setPdfLoading(false)
    }
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: result.title,
        text: `StudyPrint AIで生成した解説プリント: ${result.title}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('URLをコピーしました')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top action bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 no-print">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">ダッシュボード</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="btn-outline text-sm px-3 py-2 flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">共有</span>
            </button>

            {isPaidPlan ? (
              <button
                onClick={handleDownloadPDF}
                disabled={pdfLoading}
                className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
              >
                {pdfLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                PDF保存
              </button>
            ) : (
              <Link href="/pricing" className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
                <Crown className="w-4 h-4" />
                PDF保存（要アップグレード）
              </Link>
            )}

            <Link href="/upload" className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">新しく生成</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Print content */}
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <div ref={printRef} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-white/20 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    {result.subject}
                  </span>
                  {result.unit && (
                    <span className="bg-white/20 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      {result.unit}
                    </span>
                  )}
                  <span className="bg-white/20 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    {MODE_LABELS[generation.mode as keyof typeof MODE_LABELS] || generation.mode}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold">{result.title}</h1>
                <p className="text-blue-100 text-xs mt-2">
                  生成日時: {formatDate(generation.created_at)}
                </p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Problem */}
            <section>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                問題
              </h2>
              <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-500">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {result.detected_problem}
                </p>
              </div>
            </section>

            {/* Answer */}
            <section>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                答え
              </h2>
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <p className="text-green-800 font-bold text-lg">{result.answer}</p>
              </div>
            </section>

            {/* Steps */}
            {result.steps && result.steps.length > 0 && (
              <section>
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  途中式・解き方
                </h2>
                <div className="space-y-3">
                  {result.steps.map((step, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                        onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                      >
                        <div className="w-7 h-7 bg-blue-600 text-white text-sm font-bold rounded-lg flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </div>
                        <span className="font-semibold text-gray-800 flex-1 text-sm">{step.title}</span>
                        {expandedStep === i
                          ? <ChevronUp className="w-4 h-4 text-gray-400" />
                          : <ChevronDown className="w-4 h-4 text-gray-400" />
                        }
                      </button>
                      {(expandedStep === i || true) && (
                        <div className="px-4 pb-4">
                          {step.formula && (
                            <div className="bg-blue-50 rounded-lg p-3 mb-3 font-mono text-blue-800 text-sm">
                              {step.formula}
                            </div>
                          )}
                          <p className="text-gray-600 text-sm leading-relaxed">{step.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Key points */}
            {result.key_points && result.key_points.length > 0 && (
              <section>
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  重要ポイント
                </h2>
                <div className="space-y-2">
                  {result.key_points.map((point, i) => (
                    <div key={i} className="flex items-start gap-3 bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                      <CheckCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700 text-sm">{point}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Common mistakes */}
            {result.common_mistakes && result.common_mistakes.length > 0 && (
              <section>
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  よくあるミス
                </h2>
                <div className="space-y-2">
                  {result.common_mistakes.map((mistake, i) => (
                    <div key={i} className="flex items-start gap-3 bg-red-50 rounded-lg p-3 border border-red-200">
                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700 text-sm">{mistake}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Similar questions */}
            {result.similar_questions && result.similar_questions.length > 0 && (
              <section>
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  類題
                  {plan !== 'pro' && (
                    <Link href="/pricing" className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full hover:bg-blue-200">
                      プロプランで全解放
                    </Link>
                  )}
                </h2>
                <div className="space-y-4">
                  {result.similar_questions.map((sq, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 bg-purple-100 text-purple-700 text-xs font-bold rounded-md flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">類題</span>
                      </div>
                      <p className="text-gray-800 text-sm font-medium mb-3">{sq.question}</p>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <p className="text-xs text-purple-700 font-semibold mb-1">答え: {sq.answer}</p>
                        <p className="text-xs text-gray-600">{sq.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Summary */}
            {result.summary && (
              <section>
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  まとめ
                </h2>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-gray-700 text-sm leading-relaxed">{result.summary}</p>
                </div>
              </section>
            )}
          </div>

          {/* Footer watermark for free plan */}
          {plan === 'free' && (
            <div className="bg-gray-50 border-t border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-400">
                StudyPrint AI で生成 |{' '}
                <Link href="/pricing" className="text-blue-500 hover:underline">
                  透かしを消すにはアップグレード
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
