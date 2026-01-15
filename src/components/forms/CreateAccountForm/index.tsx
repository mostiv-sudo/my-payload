'use client'

import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

import { useAuth } from '@/providers/Auth'
import { Message } from '@/components/Message'
import { FormItem } from '@/components/forms/FormItem'
import { FormError } from '@/components/forms/FormError'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type FormData = {
  email: string
  password: string
  passwordConfirm: string
}

export const CreateAccountForm: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onBlur',
  })

  const password = watch('password')

  const passwordStrength = !password
    ? null
    : password.length >= 10
      ? 'strong'
      : password.length >= 6
        ? 'medium'
        : 'weak'

  const onSubmit = useCallback(
    async (data: FormData) => {
      setLoading(true)
      setError(null)

      try {
        // 🔐 регистрация
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        })

        if (!res.ok) {
          const json = await res.json().catch(() => null)
          throw new Error(json?.errors?.[0]?.message ?? 'Не удалось создать аккаунт')
        }

        // 🔑 автологин
        await login({
          email: data.email,
          password: data.password,
        })

        const redirectTo =
          searchParams.get('redirect') ??
          `/account?success=${encodeURIComponent('Аккаунт успешно создан')}`

        router.push(redirectTo)
      } catch (err: any) {
        setError(err.message ?? 'Ошибка регистрации')
      } finally {
        setLoading(false)
      }
    },
    [login, router, searchParams],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && <Message error={error} />}

      {/* EMAIL */}
      <FormItem>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register('email', {
            required: 'Email обязателен',
          })}
        />
        {errors.email && <FormError message={errors.email.message} />}
      </FormItem>

      {/* PASSWORD */}
      <FormItem>
        <Label htmlFor="password">Пароль</Label>

        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            {...register('password', {
              required: 'Пароль обязателен',
              minLength: {
                value: 6,
                message: 'Минимум 6 символов',
              },
            })}
          />

          <button
            type="button"
            aria-label="Показать пароль"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {passwordStrength && (
          <p
            className={`mt-2 text-xs ${
              passwordStrength === 'strong'
                ? 'text-emerald-500'
                : passwordStrength === 'medium'
                  ? 'text-yellow-500'
                  : 'text-red-500'
            }`}
          >
            {passwordStrength === 'strong' && 'Надёжный пароль'}
            {passwordStrength === 'medium' && 'Средняя надёжность'}
            {passwordStrength === 'weak' && 'Слишком простой пароль'}
          </p>
        )}

        {errors.password && <FormError message={errors.password.message} />}
      </FormItem>

      {/* CONFIRM */}
      <FormItem>
        <Label htmlFor="passwordConfirm">Подтвердите пароль</Label>
        <Input
          id="passwordConfirm"
          type="password"
          autoComplete="new-password"
          {...register('passwordConfirm', {
            required: 'Подтвердите пароль',
            validate: (value) => value === password || 'Пароли не совпадают',
          })}
        />
        {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
      </FormItem>

      {/* SUBMIT */}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Создание аккаунта…' : 'Создать аккаунт'}
      </Button>
    </form>
  )
}
