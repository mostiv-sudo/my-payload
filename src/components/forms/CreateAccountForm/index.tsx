'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
  password: string
  passwordConfirm: string
}

export const CreateAccountForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const { login } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<FormData>()

  const password = watch('password')

  const onSubmit = useCallback(
    async (data: FormData) => {
      // Убираем поле passwordConfirm — его нет в коллекции Payload
      const { passwordConfirm, ...payloadData } = data

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
        body: JSON.stringify(payloadData),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!response.ok) {
        const json = await response.json().catch(() => null)
        setError(json?.errors?.[0]?.message || 'Ошибка при создании аккаунта.')
        return
      }

      const redirect = searchParams.get('redirect')

      const timer = setTimeout(() => setLoading(true), 500)

      try {
        // Логинимся только email + password
        await login({
          email: data.email,
          password: data.password,
        })

        clearTimeout(timer)

        if (redirect) router.push(redirect)
        else router.push(`/account?success=${encodeURIComponent('Аккаунт успешно создан')}`)
      } catch (_) {
        clearTimeout(timer)
        setError('Ошибка при входе. Проверьте данные и попробуйте снова.')
      }
    },
    [login, router, searchParams],
  )

  return (
    <form className="max-w-lg py-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="prose dark:prose-invert mb-6">
        <p>Это место, где новые пользователи могут зарегистрироваться и создать аккаунт.</p>
      </div>

      <Message error={error} />

      <div className="flex flex-col gap-8 mb-8">
        <FormItem>
          <Label htmlFor="email" className="mb-2">
            Адрес электронной почты
          </Label>
          <Input
            id="email"
            type="email"
            {...register('email', { required: 'Email обязателен.' })}
          />
          {errors.email && <FormError message={errors.email.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="password" className="mb-2">
            Новый пароль
          </Label>
          <Input
            id="password"
            type="password"
            {...register('password', { required: 'Пароль обязателен.' })}
          />
          {errors.password && <FormError message={errors.password.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="passwordConfirm" className="mb-2">
            Подтвердите пароль
          </Label>
          <Input
            id="passwordConfirm"
            type="password"
            {...register('passwordConfirm', {
              required: 'Пожалуйста, подтвердите пароль.',
              validate: (value) => value === password || 'Пароли не совпадают',
            })}
          />
          {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
        </FormItem>
      </div>

      <Button disabled={loading} type="submit" variant="default">
        {loading ? 'Обработка...' : 'Создать аккаунт'}
      </Button>

      <div className="prose dark:prose-invert mt-8">
        <p>
          Уже есть аккаунт?{' '}
          <Link href={`/login${allParams}`} className="text-primary hover:underline">
            Войдите
          </Link>
        </p>
      </div>
    </form>
  )
}
