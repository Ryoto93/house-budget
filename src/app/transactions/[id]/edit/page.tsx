import { getTransactionById } from '@/lib/data/transactions';
import { getCategories } from '@/lib/data/categories';
import { getAccounts } from '@/lib/data/accounts';
import { EditTransactionForm } from '@/app/components/forms/EditTransactionForm';
import { redirect } from 'next/navigation';

// Next.js 15の標準的な型定義
interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function EditTransactionPage(props: PageProps) {
  // paramsを確実にawait
  const params = await props.params;
  const { id } = params;

  try {
    // 必要なデータを並行して取得
    const [transaction, categories, accounts] = await Promise.all([
      getTransactionById(id),
      getCategories(),
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
  } catch (error) {
    console.error('取引データの取得に失敗しました:', error);
    redirect('/transactions');
  }
}

// メタデータ生成関数
export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const { id } = params;
  
  try {
    const transaction = await getTransactionById(id);
    
    return {
      title: transaction ? `取引を編集 - ${transaction.description || 'ID: ' + id}` : '取引を編集',
      description: '取引の詳細を編集します',
    };
  } catch {
    return {
      title: '取引を編集',
      description: '取引の詳細を編集します',
    };
  }
} 