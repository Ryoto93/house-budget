'use client'

import { useState } from 'react'
import { CalendarIcon, Loader2 } from 'lucide-react'

import { createExpense } from '@/lib/actions/transaction.actions'
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
import { Label } from '@/components/ui/label'

interface ExpenseFormProps {
  categories: CategoryOption[]
  accounts: AccountOption[]
}

export function ExpenseForm({ categories, accounts }: ExpenseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    categoryId: '',
    accountId: '',
    paymentMethod: '',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // FormDataを作成
      const data = new FormData()
      data.append('date', formData.date)
      data.append('amount', formData.amount)
      data.append('categoryId', formData.categoryId)
      data.append('accountId', formData.accountId)
      data.append('paymentMethod', formData.paymentMethod)
      if (formData.description) {
        data.append('description', formData.description)
      }

      // サーバーアクションを呼び出し
      const result = await createExpense(data)

      if (result?.success) {
        // 成功時の処理
        setFormData({
          date: new Date().toISOString().split('T')[0],
          amount: '',
          categoryId: '',
          accountId: '',
          paymentMethod: '',
          description: '',
        })
        // 成功メッセージを表示（必要に応じてtoastなどを追加）
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 金額 */}
      <div className="space-y-2">
        <Label htmlFor="amount">金額</Label>
        <div className="relative">
          <Input
            id="amount"
            type="number"
            placeholder="1000"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            className="pr-12"
            required
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            円
          </span>
        </div>
      </div>

      {/* カテゴリ */}
      <div className="space-y-2">
        <Label htmlFor="categoryId">カテゴリ</Label>
        <Select value={formData.categoryId} onValueChange={(value) => handleInputChange('categoryId', value)}>
          <SelectTrigger>
            <SelectValue placeholder="カテゴリを選択" />
          </SelectTrigger>
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
      </div>

      {/* 日付 */}
      <div className="space-y-2">
        <Label htmlFor="date">日付</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          required
        />
      </div>

      {/* 支払い方法 */}
      <div className="space-y-2">
        <Label htmlFor="paymentMethod">支払い方法</Label>
        <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
          <SelectTrigger>
            <SelectValue placeholder="支払い方法を選択" />
          </SelectTrigger>
          <SelectContent>
            {paymentMethodOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 口座 */}
      <div className="space-y-2">
        <Label htmlFor="accountId">口座</Label>
        <Select value={formData.accountId} onValueChange={(value) => handleInputChange('accountId', value)}>
          <SelectTrigger>
            <SelectValue placeholder="口座を選択" />
          </SelectTrigger>
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
      </div>

      {/* メモ */}
      <div className="space-y-2">
        <Label htmlFor="description">メモ</Label>
        <Input
          id="description"
          placeholder="メモを入力（任意）"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
      </div>

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
  )
} 