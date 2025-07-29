import { prisma } from '@/lib/prisma'
import { CategoryOption } from '@/lib/types/common'

/**
 * 支出カテゴリの一覧を取得
 */
export async function getExpenseCategories(): Promise<CategoryOption[]> {
  try {
    const categories = await prisma.category.findMany({
      where: {
        type: 'expense',
      },
      orderBy: [
        { order: 'asc' },
        { name: 'asc' },
      ],
    })

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      type: category.type,
      parentType: category.parentType,
      color: category.color,
    }))
  } catch (error) {
    console.error('カテゴリ取得エラー:', error)
    return []
  }
}

/**
 * 全てのカテゴリの一覧を取得
 */
export async function getAllCategories(): Promise<CategoryOption[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [
        { type: 'asc' },
        { order: 'asc' },
        { name: 'asc' },
      ],
    })

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      type: category.type,
      parentType: category.parentType,
      color: category.color,
    }))
  } catch (error) {
    console.error('カテゴリ取得エラー:', error)
    return []
  }
} 