'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, Loader2 } from 'lucide-react'

import { createExpense } from '@/lib/actions/transaction.actions'
import { createExpenseSchema } from '@/lib/validations/transaction'
import { CategoryOption, AccountOption, paymentMethodOptions } from '@/lib/types/common'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface ExpenseFormProps {
  categories: CategoryOption[]
  accounts: AccountOption[]
}

type FormData = {
  date: string
  amount: string
  categoryId: string
  accountId: string
  paymentMethod: string
  description: string
  isRecurring: string
  recurringDay: string
}

export function ExpenseForm({ categories, accounts }: ExpenseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      amount: '',
      categoryId: '',
      accountId: '',
      paymentMethod: 'cash',
      description: '',
      isRecurring: 'false',
      recurringDay: '',
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    
    try {
      // FormDataを作成
      const formData = new FormData()
      formData.append('date', data.date)
      formData.append('amount', data.amount)
      formData.append('categoryId', data.categoryId)
      formData.append('accountId', data.accountId)
      formData.append('paymentMethod', data.paymentMethod)
      if (data.description) {
        formData.append('description', data.description)
      }
      formData.append('isRecurring', data.isRecurring)
      if (data.recurringDay) {
        formData.append('recurringDay', data.recurringDay)
      }

      // サーバーアクションを呼び出し
      const result = await createExpense(formData)

      if (result?.success) {
        // 成功時の処理
        form.reset()
        console.log('支出が正常に記録されました')
      } else {
        // エラー時の処理
        console.error('支出記録エラー:', result?.error || '予期しないエラーが発生しました')
      }
    } catch (error) {
      console.error('フォーム送信エラー:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 金額 */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>金額</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type="number"
                    placeholder="1000"
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    円
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* カテゴリ */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>カテゴリ</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="カテゴリを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <Input
                  {...field}
                  type="date"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 支払い方法 */}
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>支払い方法</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="支払い方法を選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {paymentMethodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 口座 */}
        <FormField
          control={form.control}
          name="accountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>口座</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="口座を選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{account.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {account.balance.toLocaleString()}円
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <FormLabel>メモ</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="メモを入力（任意）"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 送信ボタン */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              保存中...
            </>
          ) : (
            '支出を記録'
          )}
        </Button>
      </form>
    </Form>
  )
} 