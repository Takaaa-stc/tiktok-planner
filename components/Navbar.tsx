'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, BookOpen } from 'lucide-react'

interface NavbarProps {
  isLoggedIn?: boolean
}

export default function Navbar({ isLoggedIn = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">StudyPrint AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              機能
            </Link>
            <Link href="/#pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              料金
            </Link>
            {isLoggedIn ? (
              <Link href="/dashboard" className="btn-primary text-sm px-4 py-2">
                ダッシュボード
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
                  ログイン
                </Link>
                <Link href="/signup" className="btn-primary text-sm px-4 py-2">
                  無料で始める
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="メニュー"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <Link href="/#features" className="block text-gray-700 py-2" onClick={() => setIsOpen(false)}>
            機能
          </Link>
          <Link href="/#pricing" className="block text-gray-700 py-2" onClick={() => setIsOpen(false)}>
            料金
          </Link>
          {isLoggedIn ? (
            <Link href="/dashboard" className="block btn-primary text-center text-sm">
              ダッシュボード
            </Link>
          ) : (
            <>
              <Link href="/login" className="block text-gray-700 py-2" onClick={() => setIsOpen(false)}>
                ログイン
              </Link>
              <Link href="/signup" className="block btn-primary text-center text-sm" onClick={() => setIsOpen(false)}>
                無料で始める
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
