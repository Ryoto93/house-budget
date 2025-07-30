import { redirect } from 'next/navigation'
import { getAccounts } from '@/lib/data/accounts'
import { TransferForm } from '@/app/components/forms/TransferForm'

export default async function NewTransferPage() {
  const accounts = await getAccounts()

  if (accounts.length < 2) {
    redirect('/setup?message=振替には2つ以上の口座が必要です')
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            口座振替
          </h1>
          <p className="text-gray-600">
            口座間でお金を振り替えます
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <TransferForm accounts={accounts} />
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>
            利用可能な口座: {accounts.length}件
          </p>
          <p className="mt-1">
            振替元と振替先に異なる口座を選択してください
          </p>
        </div>
      </div>
    </div>
  )
} 