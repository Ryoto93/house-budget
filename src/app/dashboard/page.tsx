import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getSummaryData, getLatestTransactions, getCategorySpending } from '@/lib/data/dashboard'
import { TransactionType } from '@prisma/client'

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今月の収入</CardTitle>
            <svg
              className="h-4 w-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summaryData.totalIncome)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今月の支出</CardTitle>
            <svg
              className="h-4 w-4 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(summaryData.totalExpense)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総資産</CardTitle>
            <svg
              className="h-4 w-4 text-blue-600"
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
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(summaryData.totalAssets)}
            </div>
          </CardContent>
        </Card>
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