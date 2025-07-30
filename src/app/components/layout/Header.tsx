import Link from 'next/link'
import { AuthButton } from '../auth/AuthButton'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* アプリタイトル */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">House Budget</h1>
          </div>

          {/* ナビゲーションリンク */}
          <nav className="flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              ダッシュボード
            </Link>
            <Link
              href="/transactions"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              取引履歴
            </Link>
            <Link
              href="/incomes/new"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium transition-colors duration-200"
            >
              収入を記録
            </Link>
            <Link
              href="/expenses/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200"
            >
              支出を記録
            </Link>
            <Link
              href="/transfers/new"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium transition-colors duration-200"
            >
              口座振替
            </Link>
            <Link
              href="/simulations"
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 font-medium transition-colors duration-200"
            >
              シミュレーション
            </Link>
          </nav>

          {/* 認証ボタン */}
          <AuthButton />
        </div>
      </div>
    </header>
  )
} 