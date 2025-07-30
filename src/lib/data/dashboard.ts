import { prisma } from '../prisma'
import { TransactionType } from '@prisma/client'

export interface SummaryData {
  totalIncome: number
  totalExpense: number
  totalAssets: number
}

export interface LatestTransaction {
  id: string
  date: Date
  amount: number
  type: TransactionType
  description: string | null
  categoryName: string
  accountName: string
}

export interface CategorySpending {
  categoryId: string
  categoryName: string
  categoryColor: string
  totalAmount: number
}

/**
 * 今月の収入合計、支出合計、現在の総資産を取得する
 */
export async function getSummaryData(): Promise<SummaryData> {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

  // 今月の収入合計を取得
  const incomeResult = await prisma.transaction.aggregate({
    where: {
      type: TransactionType.income,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    _sum: {
      amount: true,
    },
  })

  // 今月の支出合計を取得
  const expenseResult = await prisma.transaction.aggregate({
    where: {
      type: TransactionType.expense,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    _sum: {
      amount: true,
    },
  })

  // 現在の総資産を取得（全口座の残高合計）
  const totalAssetsResult = await prisma.budgetAccount.aggregate({
    _sum: {
      balance: true,
    },
  })

  return {
    totalIncome: incomeResult._sum.amount || 0,
    totalExpense: expenseResult._sum.amount || 0,
    totalAssets: totalAssetsResult._sum.balance || 0,
  }
}

/**
 * 最新の取引を5件取得する。カテゴリ名と口座名も一緒に取得
 */
export async function getLatestTransactions(): Promise<LatestTransaction[]> {
  const transactions = await prisma.transaction.findMany({
    take: 5,
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
    categoryName: transaction.category.name,
    accountName: transaction.account.name,
  }))
}

/**
 * 今月のカテゴリ別支出合計を取得する
 */
export async function getCategorySpending(): Promise<CategorySpending[]> {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

  const categorySpending = await prisma.transaction.groupBy({
    by: ['categoryId'],
    where: {
      type: TransactionType.expense,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    _sum: {
      amount: true,
    },
  })

  // カテゴリ情報を取得
  const categoryIds = categorySpending.map((item) => item.categoryId)
  const categories = await prisma.category.findMany({
    where: {
      id: {
        in: categoryIds,
      },
    },
    select: {
      id: true,
      name: true,
      color: true,
    },
  })

  // カテゴリ情報と支出合計を結合
  return categorySpending.map((spending) => {
    const category = categories.find((cat) => cat.id === spending.categoryId)
    return {
      categoryId: spending.categoryId,
      categoryName: category?.name || 'Unknown',
      categoryColor: category?.color || '#000000',
      totalAmount: spending._sum.amount || 0,
    }
  }).sort((a, b) => b.totalAmount - a.totalAmount) // 支出金額の降順でソート
} 