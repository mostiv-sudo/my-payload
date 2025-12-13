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
    <div className="container mt-40">
      <div className="max-w-xl mx-auto my-12">
        <h1 className="mb-4 text-[1.8rem] font-semibold">Вход в аккаунт</h1>

        <p className="mb-8 text-muted-foreground leading-relaxed">
          Войдите в свой аккаунт, чтобы управлять профилем, просматривать историю действий и
          получать персональные рекомендации.
        </p>

        <LoginForm />
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Вход',
  description: 'Войдите в аккаунт или создайте новый, чтобы продолжить.',
  openGraph: {
    title: 'Вход',
    url: '/login',
  },
}
