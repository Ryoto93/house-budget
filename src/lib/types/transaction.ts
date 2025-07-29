import { Transaction } from '@prisma/client'

// サーバーアクションの戻り値の型定義
export interface ActionResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  details?: string
}

// 取引作成の戻り値の型
export type CreateTransactionResponse = ActionResponse<Transaction>

// フォームデータの型（フロントエンド用）
export interface TransactionFormData {
  date: string
  amount: string
  categoryId: string
  accountId: string
  paymentMethod?: string
  description?: string
  isRecurring?: string
  recurringDay?: string
} 