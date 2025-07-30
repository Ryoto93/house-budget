import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getSummaryData, getLatestTransactions, getCategorySpending } from '@/lib/data/dashboard'
import { TransactionType } from '@prisma/client'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { SummaryCard } from './components/SummaryCard'

export default async function DashboardPage() {
  // データを並行で取得
  const [summaryData, latestTransactions, categorySpending] = await Promise.all([
    getSummaryData(),
    getLatestTransactions(),
    getCategorySpending(),
  ])

  // 金額をフォーマットする関数
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount)
  }

  // 日付をフォーマットする関数
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date))
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">ダッシュボード</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('ja-JP', { 
            year: 'numeric', 
            month: 'long' 
          })}の概要
        </p>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-3 gap-6">
        <SummaryCard
          title="今月の収入"
          amount={summaryData.totalIncome}
          icon={TrendingUp}
        />
        <SummaryCard
          title="今月の支出"
          amount={summaryData.totalExpense}
          icon={TrendingDown}
        />
        <SummaryCard
          title="総資産"
          amount={summaryData.totalAssets}
          icon={Wallet}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最新の取引 */}
        <Card>
          <CardHeader>
            <CardTitle>最新の取引</CardTitle>
            <CardDescription>
              最近の5件の取引履歴
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {latestTransactions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  取引履歴がありません
                </p>
              ) : (
                latestTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          transaction.type === TransactionType.income
                            ? 'bg-green-500'
                            : transaction.type === TransactionType.expense
                            ? 'bg-red-500'
                            : 'bg-blue-500'
                        }`}
                      />
                      <div>
                        <p className="font-medium">
                          {transaction.description || '取引'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.categoryName} • {transaction.accountName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${
                          transaction.type === TransactionType.income
                            ? 'text-green-600'
                            : transaction.type === TransactionType.expense
                            ? 'text-red-600'
                            : 'text-blue-600'
                        }`}
                      >
                        {transaction.type === TransactionType.expense ? '-' : '+'}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* カテゴリ別支出 */}
        <Card>
          <CardHeader>
            <CardTitle>カテゴリ別支出</CardTitle>
            <CardDescription>
              今月のカテゴリ別支出合計
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categorySpending.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  支出データがありません
                </p>
              ) : (
                categorySpending.map((category) => (
                  <div
                    key={category.categoryId}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.categoryColor }}
                      />
                      <span className="font-medium">
                        {category.categoryName}
                      </span>
                    </div>
                    <span className="font-bold text-red-600">
                      {formatCurrency(category.totalAmount)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 