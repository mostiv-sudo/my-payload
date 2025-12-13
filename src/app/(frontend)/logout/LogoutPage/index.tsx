'use client'

import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, LogOut } from 'lucide-react'

export const LogoutPage: React.FC = () => {
  const { logout } = useAuth()

  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout()
        setSuccess('Вы успешно вышли из аккаунта.')
      } catch {
        setError('Вы уже вышли из аккаунта.')
      } finally {
        setLoading(false)
      }
    }

    performLogout()
  }, [logout])

  return (
    <div className="container min-h-[70vh] flex items-center justify-center">
      <Card
        className="
          max-w-md w-full
          border border-border/60
          bg-background/70
          backdrop-blur-md
          supports-[backdrop-filter]:bg-background/50
          shadow-sm
        "
      >
        <CardContent className="p-8 text-center space-y-6">
          {loading && (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <Loader2 className="animate-spin" size={32} />
              <p>Выход из аккаунта…</p>
            </div>
          )}

          {!loading && success && (
            <>
              <div className="flex flex-col items-center gap-3">
                <LogOut className="text-primary" size={36} />
                <h1 className="text-2xl font-semibold">{success}</h1>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button asChild>
                  <Link href="/anime">Перейти к аниме</Link>
                </Button>

                <Button variant="outline" asChild>
                  <Link href="/login">Войти снова</Link>
                </Button>
              </div>
            </>
          )}

          {!loading && error && (
            <>
              <h1 className="text-2xl font-semibold text-destructive">{error}</h1>

              <div className="flex justify-center pt-4">
                <Button asChild>
                  <Link href="/anime">На главную</Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
