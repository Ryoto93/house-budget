import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { EditTransactionForm } from '@/app/components/forms/EditTransactionForm'

interface EditTransactionPageProps {
  params: {
    id: string
  }
}

export default async function EditTransactionPage({ params }: EditTransactionPageProps) {
  const { id } = params

  // 取引データを取得
  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          type: true,
          color: true,
        },
      },
      account: {
        select: {
          id: true,
          name: true,
          balance: true,
        },
      },
    },
  })

  // 取引が見つからない場合は404
  if (!transaction) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            取引を編集
          </h1>
          <p className="text-gray-600">
            取引の詳細を編集できます
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <EditTransactionForm transaction={transaction} />
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>
            取引ID: {transaction.id}
          </p>
          <p className="mt-1">
            作成日: {transaction.date.toLocaleDateString('ja-JP')}
          </p>
        </div>
      </div>
    </div>
  )
} 