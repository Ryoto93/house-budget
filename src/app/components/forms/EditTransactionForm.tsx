'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/ui/date-picker'
import { Transaction, TransactionType, Category, Account } from '@prisma/client'
import { updateTransaction } from '@/lib/actions/transaction.actions'
import { Loader2 } from 'lucide-react'

// 取引データの型定義
type TransactionWithDetails = Transaction & {
  category: Category
  account: Account
}

// バリデーションスキーマ
const editTransactionSchema = z.object({
  amount: z.number().min(1, '金額は1円以上を入力してください'),
  date: z.date(),
  description: z.string().optional(),
})

type EditTransactionFormData = z.infer<typeof editTransactionSchema>

interface EditTransactionFormProps {
  transaction: TransactionWithDetails
}

export function EditTransactionForm({ transaction }: EditTransactionFormProps) {
  const form = useForm<EditTransactionFormData>({
    resolver: zodResolver(editTransactionSchema),
    defaultValues: {
      amount: transaction.amount,
      date: transaction.date,
      description: transaction.description || '',
    },
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (values: EditTransactionFormData) => {
    try {
      await updateTransaction(transaction.id, {
        amount: values.amount,
        date: values.date,
        description: values.description,
      })
      // 成功時はサーバーアクション内でリダイレクトされる
    } catch (error) {
      // エラーが発生した場合のみエラーメッセージを表示
      alert(`更新に失敗しました: ${error instanceof Error ? error.message : '予期しないエラーが発生しました'}`)
    }
  }

  const getTransactionTypeLabel = (type: TransactionType) => {
    switch (type) {
      case TransactionType.income:
        return '収入'
      case TransactionType.expense:
        return '支出'
      case TransactionType.transfer:
        return '振替'
      default:
        return '不明'
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 取引タイプ（読み取り専用） */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            取引タイプ
          </label>
          <div className="p-3 bg-gray-50 rounded-md border">
            <span className="text-gray-900">
              {getTransactionTypeLabel(transaction.type)}
            </span>
          </div>
        </div>

        {/* カテゴリ（読み取り専用） */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            カテゴリ
          </label>
          <div className="p-3 bg-gray-50 rounded-md border">
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: transaction.category.color }}
              />
              <span className="text-gray-900">
                {transaction.category.name}
              </span>
            </div>
          </div>
        </div>

        {/* 口座（読み取り専用） */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            口座
          </label>
          <div className="p-3 bg-gray-50 rounded-md border">
            <span className="text-gray-900">
              {transaction.account.name}
            </span>
          </div>
        </div>

        {/* 金額 */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>金額</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 日付 */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>日付</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  onDateChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* メモ */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メモ（任意）</FormLabel>
              <FormControl>
                <Input
                  placeholder="取引の詳細やメモを入力"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 送信ボタン */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? '更新中...' : '取引を更新'}
        </Button>
      </form>
    </Form>
  )
} 