'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createExpenseSchema } from '@/lib/validations/transaction'
import { TransactionType } from '@prisma/client'

/**
 * 新しい支出をデータベースに保存するサーバーアクション
 */
export async function createExpense(formData: FormData) {
  try {
    // 1. Zodにフォームデータ全体の解析と型変換を任せます
    const validatedFields = createExpenseSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    // 2. バリデーションに失敗した場合、エラー情報を返します
    if (!validatedFields.success) {
      console.error('Zodバリデーションエラー:', validatedFields.error.flatten().fieldErrors);
      return {
        success: false,
        error: '入力データに問題があります。',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    // 3. 検証済みのデータを分割代入で取り出します
    const { accountId, amount, ...transactionData } = validatedFields.data;

    // 4. データベース処理をトランザクションで囲み、安全性を高めます
    await prisma.$transaction(async (tx) => {
      // 取引を作成
      await tx.transaction.create({
        data: {
          ...transactionData,
          accountId,
          amount,
          type: TransactionType.expense,
        },
      });

      // 口座残高を更新
      await tx.account.update({
        where: { id: accountId },
        data: {
          balance: {
            decrement: amount,
          },
          lastUpdated: new Date(),
        },
      });
    });

    // 5. すべて成功した場合、キャッシュをクリアしてリダイレクトします
    revalidatePath('/dashboard');
    revalidatePath('/transactions');
    revalidatePath('/accounts');

    // このリダイレクトが特殊なエラーを発生させます
    redirect('/dashboard');

  } catch (error: unknown) {
    // Next.jsのリダイレクトエラーの場合
    if (error && typeof error === 'object' && 'digest' in error && 
        typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
      throw error; // リダイレクトエラーはそのまま再スロー
    }

    console.error('支出作成エラー:', error);

    // Zodバリデーションエラーの場合
    if (error instanceof Error && error.name === 'ZodError') {
        return {
          success: false,
          error: '入力データの形式に誤りがあります。',
          details: error.message,
        }
    }

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

/**
 * 新しい収入をデータベースに保存するサーバーアクション
 */
export async function createIncome(formData: FormData) {
  try {
    // 1. Zodにフォームデータ全体の解析と型変換を任せます
    const validatedFields = createExpenseSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    // 2. バリデーションに失敗した場合、エラー情報を返します
    if (!validatedFields.success) {
      console.error('Zodバリデーションエラー:', validatedFields.error.flatten().fieldErrors);
      return {
        success: false,
        error: '入力データに問題があります。',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    // 3. 検証済みのデータを分割代入で取り出します
    const { accountId, amount, ...transactionData } = validatedFields.data;

    // 4. データベース処理をトランザクションで囲み、安全性を高めます
    await prisma.$transaction(async (tx) => {
      // 取引を作成
      await tx.transaction.create({
        data: {
          ...transactionData,
          accountId,
          amount,
          type: TransactionType.income,
        },
      });

      // 口座残高を更新（収入なので増加）
      await tx.account.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: amount,
          },
          lastUpdated: new Date(),
        },
      });
    });

    // 5. すべて成功した場合、キャッシュをクリアしてリダイレクトします
    revalidatePath('/dashboard');
    revalidatePath('/transactions');
    revalidatePath('/accounts');

    // このリダイレクトが特殊なエラーを発生させます
    redirect('/dashboard');

  } catch (error: unknown) {
    // Next.jsのリダイレクトエラーの場合
    if (error && typeof error === 'object' && 'digest' in error && 
        typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
      throw error; // リダイレクトエラーはそのまま再スロー
    }

    console.error('収入作成エラー:', error);

    // Zodバリデーションエラーの場合
    if (error instanceof Error && error.name === 'ZodError') {
        return {
          success: false,
          error: '入力データの形式に誤りがあります。',
          details: error.message,
        }
    }

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
