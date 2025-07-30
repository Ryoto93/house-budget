'use client'

import { formatCurrency } from '@/lib/utils'
import { TransactionWithDetails } from '@/lib/data/transactions'
import { TransactionType } from '@prisma/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface TransactionsTableProps {
  transactions: TransactionWithDetails[]
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  // 日付をフォーマットする関数
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date))
  }

  // 取引タイプに応じた色を取得
  const getAmountColor = (type: TransactionType) => {
    switch (type) {
      case TransactionType.income:
        return 'text-green-600 font-semibold'
      case TransactionType.expense:
        return 'text-red-600 font-semibold'
      case TransactionType.transfer:
        return 'text-blue-600 font-semibold'
      default:
        return 'text-gray-900'
    }
  }

  // 取引タイプに応じた記号を取得
  const getAmountPrefix = (type: TransactionType) => {
    switch (type) {
      case TransactionType.income:
        return '+'
      case TransactionType.expense:
        return '-'
      case TransactionType.transfer:
        return '→'
      default:
        return ''
    }
  }

  if (transactions.length === 0) {
    return (
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
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>日付</TableHead>
            <TableHead>カテゴリ</TableHead>
            <TableHead className="text-right">金額</TableHead>
            <TableHead>口座</TableHead>
            <TableHead>メモ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                {formatDate(transaction.date)}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      transaction.type === TransactionType.income
                        ? 'bg-green-500'
                        : transaction.type === TransactionType.expense
                        ? 'bg-red-500'
                        : 'bg-blue-500'
                    }`}
                  />
                  <span>{transaction.categoryName}</span>
                </div>
              </TableCell>
              <TableCell className={`text-right ${getAmountColor(transaction.type)}`}>
                {getAmountPrefix(transaction.type)}
                {formatCurrency(transaction.amount)}
              </TableCell>
              <TableCell className="text-slate-600">
                {transaction.accountName}
              </TableCell>
              <TableCell className="text-slate-500 max-w-xs truncate">
                {transaction.description || '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 