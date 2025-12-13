import type { Metadata } from 'next'
import React from 'react'

import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { CreateAccountForm } from '@/components/forms/CreateAccountForm'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CreateAccount() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect(`/account?warning=${encodeURIComponent('Вы уже авторизованы.')}`)
  }

  return (
    <div className="relative flex min-h-[73vh] items-center justify-center px-4">
      {/* BACKGROUND */}
      {/* <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500/10 via-transparent to-sky-500/10" />*/}

      {/* CARD */}
      <div
        className="
          w-full max-w-lg rounded-3xl
          border border-border/60
          bg-background/80
          backdrop-blur-xl
          supports-[backdrop-filter]:bg-background/60
          shadow-lg
          p-8 md:p-10
        "
      >
        {/* HEADER */}
        <div className="mb-6 text-center">
          <h1
            className="
              text-3xl font-bold
              bg-gradient-to-r from-emerald-400 to-sky-500
              bg-clip-text text-transparent
            "
          >
            Создание аккаунта
          </h1>

          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Зарегистрируйтесь, чтобы сохранять избранное, получать рекомендации и продолжить
            просмотр.
          </p>
        </div>

        {/* FORM */}
        <CreateAccountForm />

        {/* FOOTER */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Войти
          </Link>
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Регистрация',
  description: 'Создайте аккаунт, чтобы получить доступ ко всем возможностям сервиса.',
  openGraph: {
    title: 'Регистрация',
    url: '/register',
  },
}
