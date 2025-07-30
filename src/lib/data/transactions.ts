import { prisma } from '../prisma'
import { TransactionType } from '@prisma/client'

export interface TransactionWithDetails {
  id: string
  date: Date
  amount: number
  type: TransactionType
  description: string | null
  isRecurring: boolean
  recurringDay: number | null
  categoryName: string
  accountName: string
  paymentMethod: string | null
}

/**
 * 全ての取引を新しい順に取得する（カテゴリ名と口座名も含む）
 */
export async function getAllTransactions(): Promise<TransactionWithDetails[]> {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        date: 'desc',
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        account: {
          select: {
            name: true,
          },
        },
      },
    })

    return transactions.map((transaction) => ({
      id: transaction.id,
      date: transaction.date,
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description,
      isRecurring: transaction.isRecurring,
      recurringDay: transaction.recurringDay,
      categoryName: transaction.category.name,
      accountName: transaction.account.name,
      paymentMethod: transaction.paymentMethod,
    }))
  } catch (error) {
    console.error('取引データ取得エラー:', error)
    return []
  }
} 