'use server'

import { prisma } from '@/lib/prisma'
import { TransactionType } from '@prisma/client'

// 定期的な収支の型定義
interface RecurringTransaction {
  id: string
  amount: number
  type: TransactionType
  recurringDay: number // 毎月の何日目か
  description?: string
}

// 一時的なイベントの型定義
interface WhatIfEvent {
  id: string
  date: Date
  amount: number
  type: TransactionType
  description?: string
}

// 日々の残高推移の型定義
interface DailyBalance {
  date: Date
  balance: number
  events: {
    type: 'recurring' | 'whatif'
    description: string
    amount: number
    transactionType: TransactionType
  }[]
}

// シミュレーション結果の型定義
interface SimulationResult {
  success: boolean
  data?: DailyBalance[]
  error?: string
}

/**
 * キャッシュフロー予測を計算するサーバーアクション
 */
export async function runSimulation(
  startDate: Date,
  endDate: Date,
  initialBalance: number,
  recurringTransactions: RecurringTransaction[],
  whatIfEvents: WhatIfEvent[]
): Promise<SimulationResult> {
  try {
    // バリデーション
    if (!startDate || !endDate) {
      return {
        success: false,
        error: '開始日と終了日を指定してください。',
      }
    }

    if (startDate >= endDate) {
      return {
        success: false,
        error: '開始日は終了日より前の日付を指定してください。',
      }
    }

    if (initialBalance < 0) {
      return {
        success: false,
        error: '初期残高は0以上の値を指定してください。',
      }
    }

    // 日々の残高推移を格納する配列
    const dailyBalances: DailyBalance[] = []
    
    // 現在の残高（シミュレーション中に更新される）
    let currentBalance = initialBalance

    // 開始日から終了日まで1日ずつループ
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      const dayEvents: DailyBalance['events'] = []
      
      // その日の定期的な収支を処理
      const dayOfMonth = currentDate.getDate()
      const recurringForToday = recurringTransactions.filter(
        transaction => transaction.recurringDay === dayOfMonth
      )

      for (const transaction of recurringForToday) {
        // 残高を更新
        if (transaction.type === TransactionType.income) {
          currentBalance += transaction.amount
        } else if (transaction.type === TransactionType.expense) {
          currentBalance -= transaction.amount
        }

        // イベントを記録
        dayEvents.push({
          type: 'recurring',
          description: transaction.description || '定期取引',
          amount: transaction.amount,
          transactionType: transaction.type,
        })
      }

      // その日の一時的なイベントを処理
      const whatIfForToday = whatIfEvents.filter(event => {
        const eventDate = new Date(event.date)
        return (
          eventDate.getFullYear() === currentDate.getFullYear() &&
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getDate() === currentDate.getDate()
        )
      })

      for (const event of whatIfForToday) {
        // 残高を更新
        if (event.type === TransactionType.income) {
          currentBalance += event.amount
        } else if (event.type === TransactionType.expense) {
          currentBalance -= event.amount
        }

        // イベントを記録
        dayEvents.push({
          type: 'whatif',
          description: event.description || '一時的イベント',
          amount: event.amount,
          transactionType: event.type,
        })
      }

      // その日の残高推移を記録
      dailyBalances.push({
        date: new Date(currentDate),
        balance: currentBalance,
        events: dayEvents,
      })

      // 次の日へ
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return {
      success: true,
      data: dailyBalances,
    }

  } catch (error: unknown) {
    console.error('シミュレーション実行エラー:', error)

    // データベースエラーの場合
    if (error instanceof Error) {
      return {
        success: false,
        error: 'シミュレーション実行中にエラーが発生しました。',
      }
    }

    // その他のエラー
    return {
      success: false,
      error: '予期しないエラーが発生しました。',
    }
  }
}

/**
 * 定期的な取引の一覧を取得するヘルパー関数
 */
export async function getRecurringTransactions(): Promise<RecurringTransaction[]> {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        isRecurring: true,
        recurringDay: {
          not: null,
        },
      },
      select: {
        id: true,
        amount: true,
        type: true,
        recurringDay: true,
        description: true,
      },
    })

    return transactions.map(transaction => ({
      id: transaction.id,
      amount: transaction.amount,
      type: transaction.type,
      recurringDay: transaction.recurringDay!,
      description: transaction.description || undefined,
    }))
  } catch (error) {
    console.error('定期取引取得エラー:', error)
    return []
  }
}

/**
 * シミュレーション用のサンプルデータを生成するヘルパー関数
 */
export async function generateSampleWhatIfEvents(): Promise<WhatIfEvent[]> {
  const today = new Date()
  
  return [
    {
      id: 'sample-1',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
      amount: 50000,
      type: TransactionType.income,
      description: 'ボーナス',
    },
    {
      id: 'sample-2',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15),
      amount: 15000,
      type: TransactionType.expense,
      description: '旅行費用',
    },
  ]
} 