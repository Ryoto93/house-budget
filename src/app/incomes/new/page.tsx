import { redirect } from 'next/navigation'
import { getIncomeCategories } from '@/lib/data/categories'
import { getAccounts } from '@/lib/data/accounts'
import { IncomeForm } from '@/app/components/forms/IncomeForm'

export default async function NewIncomePage() {
  // カテゴリと口座のデータを並行取得
  const [categories, accounts] = await Promise.all([
    getIncomeCategories(),
    getAccounts(),
  ])

  // データが存在しない場合はリダイレクト
  if (categories.length === 0) {
    redirect('/setup?message=収入カテゴリが設定されていません')
  }

  if (accounts.length === 0) {
    redirect('/setup?message=口座が設定されていません')
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* ページヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            新しい収入を記録
          </h1>
          <p className="text-gray-600">
            収入の詳細を入力して記録してください
          </p>
        </div>

        {/* フォーム */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <IncomeForm
            categories={categories}
            accounts={accounts}
          />
        </div>

        {/* データ情報 */}
        <div className="mt-6 text-sm text-gray-500">
          <p>
            利用可能な収入カテゴリ: {categories.length}件
          </p>
          <p>
            利用可能な口座: {accounts.length}件
          </p>
        </div>
      </div>
    </div>
  )
} 