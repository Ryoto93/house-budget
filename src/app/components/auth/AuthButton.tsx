'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function AuthButton() {
  const { data: session, status } = useSession()

  // セッション情報を読み込み中の表示
  if (status === 'loading') {
    return <div className="w-24 h-9 bg-gray-200 rounded-md animate-pulse" />
  }

  // 未ログイン時の表示
  if (!session) {
    return (
      <Button onClick={() => signIn('google')}>
        ログイン
      </Button>
    )
  }

  // ログイン済み時の表示
  return (
    <div className="flex items-center gap-4">
      {session.user?.image && (
        <Image
          src={session.user.image}
          alt={session.user.name || 'User Avatar'}
          width={32}
          height={32}
          className="rounded-full"
        />
      )}
      <Button onClick={() => signOut()} variant="outline">
        ログアウト
      </Button>
    </div>
  )
} 