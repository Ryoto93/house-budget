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
    <Card>
      <CardHeader>
        <CardTitle>最新の取引</CardTitle>
        <CardDescription>
          最近の取引履歴
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              取引履歴がありません
            </p>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col">
                    <p className="font-medium">
                      {transaction.categoryName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
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