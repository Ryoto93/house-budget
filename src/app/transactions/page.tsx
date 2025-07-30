import { getAllTransactions } from '@/lib/data/transactions'
import { TransactionsTable } from './components/TransactionsTable'

export default async function TransactionsPage() {
  const transactions = await getAllTransactions()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">取引履歴</h1>
        <p className="text-gray-600">
          全ての取引履歴を確認できます
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              取引一覧
            </h2>
            <div className="text-sm text-gray-500">
              全 {transactions.length} 件
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <TransactionsTable transactions={transactions} />
        </div>
      </div>
    </div>
  )
} 