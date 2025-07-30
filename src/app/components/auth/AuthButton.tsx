'use client'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogIn, LogOut, User } from 'lucide-react'

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <Button variant="outline" disabled>
        <User className="h-4 w-4 mr-2" />
        読み込み中...
      </Button>
    )
  }

  if (!session) {
    return (
      <Button onClick={() => signIn('google')} variant="default">
        <LogIn className="h-4 w-4 mr-2" />
        ログイン
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 text-sm">
        <User className="h-4 w-4" />
        <span>{session.user?.name || session.user?.email}</span>
      </div>
      <Button onClick={() => signOut()} variant="outline" size="sm">
        <LogOut className="h-4 w-4 mr-2" />
        ログアウト
      </Button>
    </div>
  )
} 