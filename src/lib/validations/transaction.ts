import { z } from 'zod'
import { TransactionType, PaymentMethod } from '@prisma/client'

// 支出作成用のスキーマ（FormData対応）
export const createExpenseSchema = z.object({
  date: z.coerce.date(),
  amount: z.coerce.number().positive('金額は正の数である必要があります'),
  categoryId: z.string().min(1, 'カテゴリを選択してください'),
  accountId: z.string().min(1, '口座を選択してください'),
  paymentMethod: z.nativeEnum(PaymentMethod),
  description: z.string().optional(),
  isRecurring: z.coerce.boolean().default(false),
  recurringDay: z.coerce.number().min(1).max(31).optional(),
})

// 取引作成用のスキーマ（収入・支出・振替に対応）
export const createTransactionSchema = z.object({
  date: z.coerce.date(),
  amount: z.coerce.number().positive('金額は正の数である必要があります'),
  type: z.nativeEnum(TransactionType),
  categoryId: z.string().min(1, 'カテゴリを選択してください'),
  accountId: z.string().min(1, '口座を選択してください'),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  description: z.string().optional(),
  isRecurring: z.coerce.boolean().default(false),
  recurringDay: z.coerce.number().min(1).max(31).optional(),
})

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>
export type CreateTransactionInput = z.infer<typeof createTransactionSchema> 