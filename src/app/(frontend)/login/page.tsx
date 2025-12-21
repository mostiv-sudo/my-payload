import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { LoginForm } from '@/components/forms/LoginForm'
import { redirect } from 'next/navigation'

export default async function Login() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect(`/account?warning=${encodeURIComponent('Вы уже авторизованы.')}`)
  }

  return (
    <div className="relative flex min-h-[73vh] items-center justify-center px-4">
      {/* BACKGROUND */}
      {/* <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-500/10 via-transparent to-emerald-500/10" /> */}

      {/* CARD */}
      <div
        className="
          w-full max-w-lg flex flex-col gap-6 rounded-3xl
          border border-border/60
          bg-background/80
          backdrop-blur-xl
          supports-[backdrop-filter]:bg-background/60
          shadow-lg
          p-8 md:p-10
        "
      >
        {/* HEADER */}
        <header className="flex flex-col gap-3 text-center">
          <h1
            className="
              text-3xl font-bold
              bg-gradient-to-r from-sky-400 to-emerald-500
              bg-clip-text text-transparent
            "
          >
            Вход в аккаунт
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Войдите, чтобы управлять профилем, получать рекомендации и продолжить просмотр.
          </p>
        </header>

        {/* FORM */}
        <LoginForm />

        {/* FOOTER */}
        <footer className="text-center text-sm text-muted-foreground">
          Нет аккаунта?{' '}
          <Link
            href="/create-account"
            className="font-medium text-primary hover:underline transition-colors duration-200"
          >
            Зарегистрироваться
          </Link>
        </footer>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Вход',
  description: 'Войдите в аккаунт, чтобы получить доступ ко всем возможностям сервиса.',
  openGraph: {
    title: 'Вход',
    url: '/login',
  },
}
