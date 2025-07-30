import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getSummaryData, getLatestTransactions, getCategorySpending } from '@/lib/data/dashboard'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { SummaryCard } from './components/SummaryCard'
import { RecentTransactions } from './components/RecentTransactions'
import { CategoryChart } from './components/CategoryChart'

export default async function DashboardPage() {
  // データを並行で取得
  const [summaryData, latestTransactions, categorySpending] = await Promise.all([
    getSummaryData(),
    getLatestTransactions(),
    getCategorySpending(),
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        {/* ヘッダーセクション */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                ダッシュボード
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                {new Date().toLocaleDateString('ja-JP', { 
                  year: 'numeric', 
                  month: 'long' 
                })}の家計状況
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Wallet className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* サマリーカードセクション */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        </div>

        {/* メインコンテンツセクション */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* 最新の取引 - 2列分の幅 */}
          <div className="xl:col-span-2">
            <RecentTransactions transactions={latestTransactions} />
          </div>
          
          {/* カテゴリチャート - 1列分の幅 */}
          <div className="xl:col-span-1">
            <Card className="h-full border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl font-semibold text-slate-800">
                  支出の内訳
                </CardTitle>
                <CardDescription className="text-slate-600">
                  カテゴリ別の支出割合
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <CategoryChart 
                  data={categorySpending.map(category => ({
                    name: category.categoryName,
                    total: category.totalAmount,
                    color: category.categoryColor
                  }))}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 