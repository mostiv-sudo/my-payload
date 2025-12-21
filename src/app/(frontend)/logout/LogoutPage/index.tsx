'use client'

import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, LogOut } from 'lucide-react'

export const LogoutPage: React.FC = () => {
  const { logout } = useAuth()

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState<string>('Выход из аккаунта…')

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
      <Card className="max-w-md w-full border border-border/60 bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/50 shadow-sm transition-all">
        <CardContent className="p-8 text-center space-y-6">
          {status === 'loading' && (
            <div
              className="flex flex-col items-center gap-4 text-muted-foreground"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="animate-spin" size={32} />
              <p>{message}</p>
            </div>
          )}

          {(status === 'success' || status === 'error') && (
            <>
              <div className="flex flex-col items-center gap-3">
                <LogOut
                  className={`text-${status === 'success' ? 'primary' : 'destructive'}`}
                  size={36}
                />
                <h1
                  className={`text-2xl font-semibold ${status === 'error' ? 'text-destructive' : ''}`}
                >
                  {message}
                </h1>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button asChild className="transition-colors duration-200">
                  <Link href="/anime">Перейти к аниме</Link>
                </Button>

                {status === 'success' && (
                  <Button variant="outline" asChild className="transition-colors duration-200">
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
