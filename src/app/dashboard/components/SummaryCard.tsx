import { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

interface SummaryCardProps {
  title: string
  amount: number
  icon: LucideIcon
}

export function SummaryCard({ title, amount, icon: Icon }: SummaryCardProps) {
  // 金額を3桁区切りでフォーマット
  const formattedAmount = amount.toLocaleString()

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
          {title}
        </CardTitle>
        <div className="p-3 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 rounded-xl group-hover:from-blue-500/20 group-hover:to-indigo-600/20 transition-all duration-300">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
          {formattedAmount}
          <span className="text-lg font-medium text-slate-500 ml-1">円</span>
        </div>
      </CardContent>
    </Card>
  )
} 