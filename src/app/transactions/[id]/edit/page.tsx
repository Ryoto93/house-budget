import { getTransactionById } from '@/lib/data/transactions';
import { getCategories } from '@/lib/data/categories';
import { getAccounts } from '@/lib/data/accounts';
import { EditTransactionForm } from '@/app/components/forms/EditTransactionForm';
import { redirect } from 'next/navigation';

// ★ Next.jsのApp Routerが期待する、最も直接的で正確な型定義
export default async function EditTransactionPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // 必要なデータを並行して取得
  const [transaction, categories, accounts] = await Promise.all([
    getTransactionById(id),
    getCategories(), // 収入・支出両方のカテゴリを取得
    getAccounts(),
  ]);

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
          <EditTransactionForm
            transaction={transaction}
            categories={categories}
            accounts={accounts}
          />
        </div>
      </div>
    </div>
  );
} 