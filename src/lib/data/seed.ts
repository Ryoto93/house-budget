import { prisma } from '@/lib/prisma'
import { CategoryType, ParentType, AccountType, Currency } from '@prisma/client'

/**
 * 初期データを投入
 */
export async function seedData() {
  try {
    console.log('初期データの投入を開始...')

    // カテゴリの作成
    const categories = await prisma.category.createMany({
      data: [
        // 固定費
        {
          name: '家賃',
          type: CategoryType.expense,
          parentType: ParentType.fixed,
          isCustom: false,
          order: 1,
          color: '#ef4444',
        },
        {
          name: '光熱費',
          type: CategoryType.expense,
          parentType: ParentType.fixed,
          isCustom: false,
          order: 2,
          color: '#f97316',
        },
        {
          name: '通信費',
          type: CategoryType.expense,
          parentType: ParentType.fixed,
          isCustom: false,
          order: 3,
          color: '#eab308',
        },
        {
          name: '保険料',
          type: CategoryType.expense,
          parentType: ParentType.fixed,
          isCustom: false,
          order: 4,
          color: '#84cc16',
        },
        // 変動費
        {
          name: '食費',
          type: CategoryType.expense,
          parentType: ParentType.variable,
          isCustom: false,
          order: 5,
          color: '#22c55e',
        },
        {
          name: '交通費',
          type: CategoryType.expense,
          parentType: ParentType.variable,
          isCustom: false,
          order: 6,
          color: '#06b6d4',
        },
        {
          name: '日用品',
          type: CategoryType.expense,
          parentType: ParentType.variable,
          isCustom: false,
          order: 7,
          color: '#3b82f6',
        },
        {
          name: '衣服',
          type: CategoryType.expense,
          parentType: ParentType.variable,
          isCustom: false,
          order: 8,
          color: '#8b5cf6',
        },
        {
          name: '娯楽費',
          type: CategoryType.expense,
          parentType: ParentType.variable,
          isCustom: false,
          order: 9,
          color: '#ec4899',
        },
        // 収入カテゴリ
        {
          name: '給料',
          type: CategoryType.income,
          parentType: ParentType.regular,
          isCustom: false,
          order: 1,
          color: '#10b981',
        },
        {
          name: 'ボーナス',
          type: CategoryType.income,
          parentType: ParentType.temporary,
          isCustom: false,
          order: 2,
          color: '#059669',
        },
        {
          name: '副業収入',
          type: CategoryType.income,
          parentType: ParentType.variable,
          isCustom: false,
          order: 3,
          color: '#047857',
        },
      ],
    })

    // 口座の作成
    const accounts = await prisma.account.createMany({
      data: [
        {
          name: 'メインバンク',
          type: AccountType.bank,
          balance: 100000,
          currency: Currency.JPY,
        },
        {
          name: '現金',
          type: AccountType.cash,
          balance: 50000,
          currency: Currency.JPY,
        },
        {
          name: 'クレジットカード',
          type: AccountType.credit_card,
          balance: 0,
          currency: Currency.JPY,
        },
        {
          name: '電子マネー',
          type: AccountType.e_money,
          balance: 10000,
          currency: Currency.JPY,
        },
      ],
    })

    console.log(`✅ カテゴリ ${categories.count}件 を作成しました`)
    console.log(`✅ 口座 ${accounts.count}件 を作成しました`)
    console.log('初期データの投入が完了しました')

  } catch (error) {
    console.error('初期データ投入エラー:', error)
    throw error
  }
}

/**
 * データベースをリセットして初期データを投入
 */
export async function resetAndSeed() {
  try {
    console.log('データベースをリセット中...')
    
    // 既存データを削除
    await prisma.transaction.deleteMany()
    await prisma.transactionTemplate.deleteMany()
    await prisma.budget.deleteMany()
    await prisma.simulation.deleteMany()
    await prisma.category.deleteMany()
    await prisma.account.deleteMany()

    console.log('✅ データベースをリセットしました')

    // 初期データを投入
    await seedData()

  } catch (error) {
    console.error('リセット・シードエラー:', error)
    throw error
  }
} 