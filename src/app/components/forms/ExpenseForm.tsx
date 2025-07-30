'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { createExpense } from '../../../lib/actions/transaction.actions'
import { createExpenseSchema, CreateExpenseInput } from '../../../lib/validations/transaction'
import { AccountOption, CategoryOption, paymentMethodOptions } from '../../../lib/types/common'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover'
import { Calendar } from '../../../components/ui/calendar'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form'

interface ExpenseFormProps {
  categories: CategoryOption[]
  accounts: AccountOption[]
}

export function ExpenseForm({ categories, accounts }: ExpenseFormProps) {
  // 1. react-hook-formのセットアップ
  const form = useForm<CreateExpenseInput>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      date: new Date(),
      amount: 0, // amountは数値として初期化
      categoryId: '',
      accountId: '',
      paymentMethod: 'cash' as const,
      description: '',
      isRecurring: false,
    },
  })

  const { isSubmitting } = form.formState

  // 2. サーバーアクションを呼び出す処理
  const onSubmit = async (values: CreateExpenseInput) => {
    // FormDataオブジェクトをプログラムで作成
    const formData = new FormData()
    formData.append('date', values.date.toISOString())
    formData.append('amount', String(values.amount))
    formData.append('categoryId', values.categoryId)
    formData.append('accountId', values.accountId)
    if (values.paymentMethod) {
      formData.append('paymentMethod', values.paymentMethod)
    }
    if (values.description) {
      formData.append('description', values.description)
    }

    // サーバーアクションを直接呼び出すだけ。try...catchは不要！
    await createExpense(formData)

    // リダイレクトはサーバーアクション側で行われるため、ここでの成功/失敗処理は不要
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
                  <Input type="number" placeholder="1000" {...field} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">円</span>
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
                      {category.name}
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
            <FormItem className="flex flex-col">
              <FormLabel>日付</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: ja })
                      ) : (
                        <span>日付を選択</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    locale={ja}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* 支払い方法と口座を横並びに */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* メモ */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メモ</FormLabel>
              <FormControl>
                <Input placeholder="メモを入力（任意）" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 送信ボタン */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? '保存中...' : '支出を記録'}
        </Button>
      </form>
    </Form>
  )
} 