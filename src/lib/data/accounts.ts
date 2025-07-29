import { prisma } from '@/lib/prisma'
import { AccountOption } from '@/lib/types/common'
import { Currency } from '@prisma/client'

/**
 * 口座の一覧を取得
 */
export async function getAccounts(): Promise<AccountOption[]> {
  try {
    const accounts = await prisma.account.findMany({
      orderBy: [
        { type: 'asc' },
        { name: 'asc' },
      ],
    })

    return accounts.map((account) => ({
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.balance,
      currency: account.currency,
    }))
  } catch (error) {
    console.error('口座取得エラー:', error)
    return []
  }
}

/**
 * 特定の通貨の口座一覧を取得
 */
export async function getAccountsByCurrency(currency: string): Promise<AccountOption[]> {
  try {
    const accounts = await prisma.account.findMany({
      where: {
        currency: currency as Currency,
      },
      orderBy: [
        { type: 'asc' },
        { name: 'asc' },
      ],
    })

    return accounts.map((account) => ({
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.balance,
      currency: account.currency,
    }))
  } catch (error) {
    console.error('口座取得エラー:', error)
    return []
  }
} 