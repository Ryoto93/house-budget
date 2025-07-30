'use server'

import { prisma } from '@/lib/prisma'
import { TransactionType } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

interface CreateTransferInput {
  fromAccountId: string
  toAccountId: string
  amount: number
  date: Date
  description?: string
}

/**
 * 口座振替を行うサーバーアクション
 */
export async function createTransfer(data: CreateTransferInput) {
  try {
    const { fromAccountId, toAccountId, amount, date, description } = data

    // バリデーション
    if (!fromAccountId || !toAccountId || !amount || !date) {
      return {
        success: false,
        error: '必須項目が不足しています。',
      }
    }

    if (fromAccountId === toAccountId) {
      return {
        success: false,
        error: '振替元と振替先の口座が同じです。',
      }
    }

    if (amount <= 0) {
      return {
        success: false,
        error: '振替金額は0より大きい値を入力してください。',
      }
    }

    // 口座の存在確認
    const [fromAccount, toAccount] = await Promise.all([
      prisma.budgetAccount.findUnique({
        where: { id: fromAccountId },
      }),
      prisma.budgetAccount.findUnique({
        where: { id: toAccountId },
      }),
    ])

    if (!fromAccount || !toAccount) {
      return {
        success: false,
        error: '指定された口座が見つかりません。',
      }
    }

    // 振替元口座の残高確認
    if (fromAccount.balance < amount) {
      return {
        success: false,
        error: '振替元口座の残高が不足しています。',
      }
    }

    // トランザクションで一連の処理を実行
    await prisma.$transaction(async (tx) => {
      // 振替元口座の残高を減らす
      await tx.budgetAccount.update({
        where: { id: fromAccountId },
        data: {
          balance: {
            decrement: amount,
          },
          lastUpdated: new Date(),
        },
      })

      // 振替先口座の残高を増やす
      await tx.budgetAccount.update({
        where: { id: toAccountId },
        data: {
          balance: {
            increment: amount,
          },
          lastUpdated: new Date(),
        },
      })

      // 振替元口座の取引記録を作成
      await tx.transaction.create({
        data: {
          date,
          amount,
          type: TransactionType.transfer,
          description: description || `振替先: ${toAccount.name}`,
          accountId: fromAccountId,
          categoryId: 'transfer', // 振替用のカテゴリID（必要に応じて調整）
          paymentMethod: null, // 振替の場合は支払い方法なし
          isRecurring: false,
        },
      })

      // 振替先口座の取引記録を作成
      await tx.transaction.create({
        data: {
          date,
          amount,
          type: TransactionType.transfer,
          description: description || `振替元: ${fromAccount.name}`,
          accountId: toAccountId,
          categoryId: 'transfer', // 振替用のカテゴリID（必要に応じて調整）
          paymentMethod: null, // 振替の場合は支払い方法なし
          isRecurring: false,
        },
      })
    })

    // キャッシュをクリア
    revalidatePath('/dashboard')
    revalidatePath('/transactions')
    revalidatePath('/accounts')

    // ダッシュボードにリダイレクト
    redirect('/dashboard')

  } catch (error: unknown) {
    console.error('口座振替エラー:', error)

    // データベースエラーの場合
    if (error instanceof Error) {
      return {
        success: false,
        error: 'データベースエラーが発生しました。',
        details: error.message,
      }
    }

    // その他のエラー
    return {
      success: false,
      error: '予期しないエラーが発生しました。',
    }
  }
} 