import { z } from 'zod'
import { TransactionType, PaymentMethod } from '@prisma/client'

// 支出作成用のスキーマ（FormData対応）
export const createExpenseSchema = z.object({
  date: z.string().transform((val) => new Date(val)),
  amount: z.string().transform((val) => parseInt(val, 10)),
  categoryId: z.string().min(1, 'カテゴリを選択してください'),
  accountId: z.string().min(1, '口座を選択してください'),
  paymentMethod: z.nativeEnum(PaymentMethod),
  description: z.string().optional(),
  isRecurring: z.string().optional().transform((val) => val === 'true'),
  recurringDay: z.string().optional().transform((val) => val ? parseInt(val, 10) : undefined),
}).refine((data) => data.amount > 0, {
  message: '金額は正の数である必要があります',
  path: ['amount'],
}).refine((data) => !data.recurringDay || (data.recurringDay >= 1 && data.recurringDay <= 31), {
  message: '繰り返し日は1〜31の間で指定してください',
  path: ['recurringDay'],
})

// 取引作成用のスキーマ（収入・支出・振替に対応）
export const createTransactionSchema = z.object({
  date: z.string().transform((val) => new Date(val)),
  amount: z.string().transform((val) => parseInt(val, 10)),
  type: z.nativeEnum(TransactionType),
  categoryId: z.string().min(1, 'カテゴリを選択してください'),
  accountId: z.string().min(1, '口座を選択してください'),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  description: z.string().optional(),
  isRecurring: z.string().optional().transform((val) => val === 'true'),
  recurringDay: z.string().optional().transform((val) => val ? parseInt(val, 10) : undefined),
}).refine((data) => data.amount > 0, {
  message: '金額は正の数である必要があります',
  path: ['amount'],
}).refine((data) => !data.recurringDay || (data.recurringDay >= 1 && data.recurringDay <= 31), {
  message: '繰り返し日は1〜31の間で指定してください',
  path: ['recurringDay'],
})

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>
export type CreateTransactionInput = z.infer<typeof createTransactionSchema> 