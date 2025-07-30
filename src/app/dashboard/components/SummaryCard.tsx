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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formattedAmount} 円
        </div>
      </CardContent>
    </Card>
  )
} 