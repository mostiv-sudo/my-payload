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
import { Eye, EyeOff } from 'lucide-react'

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
  const [showPassword, setShowPassword] = useState(false)

  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<FormData>()

  const password = watch('password')

  const passwordStrength =
    password?.length >= 10 ? 'strong' : password?.length >= 6 ? 'medium' : 'weak'

  const onSubmit = useCallback(
    async (data: FormData) => {
      setLoading(true)
      setError(null)

      const { passwordConfirm, ...payloadData } = data

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadData),
        })

        if (!response.ok) {
          const json = await response.json().catch(() => null)
          throw new Error(json?.errors?.[0]?.message || 'Не удалось создать аккаунт')
        }

        await login({ email: data.email, password: data.password })

        const redirect = searchParams.get('redirect')
        router.push(redirect ?? `/account?success=${encodeURIComponent('Аккаунт успешно создан')}`)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    },
    [login, router, searchParams],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Message error={error} />

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
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* STRENGTH */}
        {password && (
          <p
            className={`
              text-xs mt-2
              ${
                passwordStrength === 'strong'
                  ? 'text-emerald-500'
                  : passwordStrength === 'medium'
                    ? 'text-yellow-500'
                    : 'text-red-500'
              }
            `}
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
          {...register('passwordConfirm', {
            required: 'Подтвердите пароль.',
            validate: (value) => value === password || 'Пароли не совпадают',
          })}
        />
        {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
      </FormItem>

      {/* SUBMIT */}
      <Button className="w-full" disabled={loading} type="submit">
        {loading ? 'Создание аккаунта…' : 'Создать аккаунт'}
      </Button>
    </form>
  )
}
