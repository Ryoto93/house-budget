import { Category, Account, PaymentMethod } from '@prisma/client'

// カテゴリの型（表示用）
export interface CategoryOption {
  id: string
  name: string
  type: Category['type']
  parentType: Category['parentType']
  color: string
}

// 口座の型（表示用）
export interface AccountOption {
  id: string
  name: string
  type: Account['type']
  balance: number
  currency: Account['currency']
}

// 支払い方法のオプション
export const paymentMethodOptions = [
  { value: PaymentMethod.cash, label: '現金' },
  { value: PaymentMethod.credit, label: 'クレジットカード' },
  { value: PaymentMethod.e_money, label: '電子マネー' },
] as const 