'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'

type FormData = {
  email: string
  password: string
  passwordConfirm: string
}

export const CreateAccountForm: React.FC = () => {
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>()

  const password = watch('password')

  const passwordStrength = password
    ? password.length >= 10
      ? 'strong'
      : password.length >= 6
        ? 'medium'
        : 'weak'
    : null

  const onSubmit = useCallback(
    async (data: FormData) => {
      setLoading(true)
      setError(null)

      const { passwordConfirm, ...payload } = data

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const json = await res.json().catch(() => null)
          throw new Error(json?.errors?.[0]?.message || 'Не удалось создать аккаунт')
        }

        await login({ email: data.email, password: data.password })

        const redirect = searchParams.get('redirect')
        router.push(redirect ?? `/account?success=${encodeURIComponent('Аккаунт успешно создан')}`)
      } catch (err: any) {
        setError(err.message || 'Не удалось создать аккаунт')
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
          placeholder="you@example.com"
          {...register('email', { required: 'Email обязателен.' })}
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
            {...register('password', {
              required: 'Пароль обязателен.',
              minLength: { value: 6, message: 'Минимум 6 символов' },
            })}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {passwordStrength && (
          <p
            className={`text-xs mt-2 ${
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

      {/* CONFIRM PASSWORD */}
      <FormItem>
        <Label htmlFor="passwordConfirm">Подтвердите пароль</Label>
        <Input
          id="passwordConfirm"
          type="password"
          {...register('passwordConfirm', {
            required: 'Подтвердите пароль.',
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
