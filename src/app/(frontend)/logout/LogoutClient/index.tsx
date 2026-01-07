// app/logout/LogoutClient.tsx
'use client' // обязательно для хуков и useState/useEffect

import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, LogOut } from 'lucide-react'

type Status = 'loading' | 'success' | 'error'

export default function LogoutClient() {
  const { logout } = useAuth()
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState('Выход из аккаунта…')

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout()
        setMessage('Вы успешно вышли из аккаунта.')
        setStatus('success')
      } catch {
        setMessage('Вы уже вышли из аккаунта.')
        setStatus('error')
      }
    }

    performLogout()
  }, [logout])

  return (
    <div className="container min-h-[70vh] flex items-center justify-center">
      <Card className="max-w-md w-full border border-border/60 bg-background/70 backdrop-blur-md shadow-sm">
        <CardContent className="p-8 text-center space-y-6">
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <Loader2 className="animate-spin" size={32} />
              <p>{message}</p>
            </div>
          )}

          {(status === 'success' || status === 'error') && (
            <>
              <div className="flex flex-col items-center gap-3">
                <LogOut
                  className={status === 'success' ? 'text-primary' : 'text-destructive'}
                  size={36}
                />
                <h1
                  className={`text-2xl font-semibold ${status === 'error' ? 'text-destructive' : ''}`}
                >
                  {message}
                </h1>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button asChild>
                  <Link href="/anime">Перейти к аниме</Link>
                </Button>

                {status === 'success' && (
                  <Button variant="outline" asChild>
                    <Link href="/login">Войти снова</Link>
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
