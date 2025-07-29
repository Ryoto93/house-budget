import { prisma } from '@/lib/prisma'
import { TransactionType } from '@prisma/client'

// 今月の開始日と終了日を取得するヘルパー関数
function getCurrentMonthRange() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
  return { startOfMonth, endOfMonth }
}

/**
 * 今月の収入合計、支出合計、現在の総資産を取得する
 */
export async function getSummaryData() {
  try {
    const { startOfMonth, endOfMonth } = getCurrentMonthRange()

    // 今月の収入合計を取得
    const incomeTotal = await prisma.transaction.aggregate({
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
    const expenseTotal = await prisma.transaction.aggregate({
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

    // 現在の総資産（全口座の残高合計）を取得
    const totalAssets = await prisma.account.aggregate({
      _sum: {
        balance: true,
      },
    })

    return {
      incomeTotal: incomeTotal._sum.amount || 0,
      expenseTotal: expenseTotal._sum.amount || 0,
      totalAssets: totalAssets._sum.balance || 0,
      netIncome: (incomeTotal._sum.amount || 0) - (expenseTotal._sum.amount || 0),
    }
  } catch (error) {
    console.error('サマリーデータ取得エラー:', error)
    throw new Error('サマリーデータの取得に失敗しました')
  }
}

/**
 * 最新の取引を5件取得する（カテゴリ名と口座名も含む）
 */
export async function getLatestTransactions() {
  try {
    const transactions = await prisma.transaction.findMany({
      take: 5,
      orderBy: {
        date: 'desc',
      },
      include: {
        category: {
          select: {
            name: true,
            color: true,
          },
        },
        account: {
          select: {
            name: true,
          },
        },
      },
    })

    return transactions.map(transaction => ({
      id: transaction.id,
      date: transaction.date,
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description,
      categoryName: transaction.category.name,
      categoryColor: transaction.category.color,
      accountName: transaction.account.name,
    }))
  } catch (error) {
    console.error('最新取引データ取得エラー:', error)
    throw new Error('最新取引データの取得に失敗しました')
  }
}

/**
 * 今月のカテゴリ別支出合計を取得する
 */
export async function getCategorySpending() {
  try {
    const { startOfMonth, endOfMonth } = getCurrentMonthRange()

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
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
    })

    // カテゴリ情報も取得
    const categoryIds = categorySpending.map(item => item.categoryId)
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

    // カテゴリ情報と支出額を結合
    const result = categorySpending.map(spending => {
      const category = categories.find(cat => cat.id === spending.categoryId)
      return {
        categoryId: spending.categoryId,
        categoryName: category?.name || '不明',
        categoryColor: category?.color || '#000000',
        amount: spending._sum.amount || 0,
      }
    })

    return result
  } catch (error) {
    console.error('カテゴリ別支出データ取得エラー:', error)
    throw new Error('カテゴリ別支出データの取得に失敗しました')
  }
}

/**
 * 型定義
 */
export interface SummaryData {
  incomeTotal: number
  expenseTotal: number
  totalAssets: number
  netIncome: number
}

export interface LatestTransaction {
  id: string
  date: Date
  amount: number
  type: TransactionType
  description: string | null
  categoryName: string
  categoryColor: string
  accountName: string
}

export interface CategorySpending {
  categoryId: string
  categoryName: string
  categoryColor: string
  amount: number
} 