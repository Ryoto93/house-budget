import { prisma } from '@/lib/prisma';
import { EditTransactionForm } from '@/app/components/forms/EditTransactionForm';
import { redirect } from 'next/navigation';

// ★ Next.jsのApp Routerが期待する正しい型定義
interface EditTransactionPageProps {
  params: {
    id: string;
  };
}

export default async function EditTransactionPage({ params }: EditTransactionPageProps) {
  const { id } = params;

  // 取引データを取得
  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: {
      category: true,
      account: true,
    },
  });

  // 取引データが見つからなければ、取引一覧ページにリダイレクト
  if (!transaction) {
    redirect('/transactions');
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            取引を編集
          </h1>
          <p className="text-gray-600">
            取引の詳細を編集して保存してください
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <EditTransactionForm transaction={transaction} />
        </div>
      </div>
    </div>
  );
} 