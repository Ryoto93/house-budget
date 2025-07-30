import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { formatCurrency } from '../../../lib/utils'
import { LatestTransaction } from '../../../lib/data/dashboard'

interface RecentTransactionsProps {
  transactions: LatestTransaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  // 日付をフォーマットする関数
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date))
  }

  return (
    <Card className="h-full border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="text-xl font-semibold text-slate-800">
          最新の取引
        </CardTitle>
        <CardDescription className="text-slate-600">
          最近の取引履歴
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-slate-500 font-medium">取引履歴がありません</p>
                <p className="text-slate-400 text-sm mt-1">新しい取引を追加してください</p>
              </div>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="group flex items-center justify-between p-4 rounded-xl border border-slate-200/50 hover:border-slate-300 hover:bg-slate-50/50 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <p className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                      {transaction.categoryName}
                    </p>
                    <p className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-slate-900 group-hover:text-slate-800 transition-colors">
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
} 