import type { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { CreateAccountForm } from '@/components/forms/CreateAccountForm'

export default async function CreateAccountPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })

  const { user } = await payload.auth({ headers })

  // 🔒 Уже авторизован — редирект в аккаунт
  if (user) {
    redirect(`/account?warning=${encodeURIComponent('Вы уже вошли в систему')}`)
  }

  return (
    <div className="relative flex min-h-[73vh] items-center justify-center px-4">
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-sky-500 bg-clip-text text-transparent">
            Создание аккаунта
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Зарегистрируйтесь, чтобы сохранять избранное, получать рекомендации и продолжить
            просмотр.
          </p>
        </header>

        {/* FORM */}
        <CreateAccountForm />

        {/* FOOTER */}
        <footer className="text-center text-sm text-muted-foreground">
          Уже есть аккаунт?{' '}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline transition-colors"
          >
            Войти
          </Link>
        </footer>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Регистрация',
  description: 'Создайте аккаунт и получите доступ ко всем возможностям сервиса.',
  openGraph: {
    title: 'Регистрация',
    url: '/register',
  },
}
