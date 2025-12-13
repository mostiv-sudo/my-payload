'use client'

import React, { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'

import { useAuth } from '@/providers/Auth'

import { FormItem } from '@/components/forms/FormItem'
import { FormError } from '@/components/forms/FormError'
import { Message } from '@/components/Message'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

type FormData = {
  email: string
  password: string
}

export const LoginForm: React.FC = () => {
  const searchParams = useSearchParams()
  const redirect = useRef(searchParams.get('redirect'))
  const router = useRouter()
  const { login } = useAuth()

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      setLoading(true)
      setError(null)

      try {
        await login(data)
        router.push(redirect.current || '/account')
      } catch {
        setError('Неверный email или пароль. Попробуйте ещё раз.')
      } finally {
        setLoading(false)
      }
    },
    [login, router],
  )

  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* GLOBAL ERROR */}
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
            placeholder="••••••••"
            {...register('password', { required: 'Введите пароль.' })}
          />

          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {errors.password && <FormError message={errors.password.message} />}
      </FormItem>

      {/* RECOVER */}
      <p className="text-sm text-muted-foreground">
        Забыли пароль?{' '}
        <Link href={`/recover-password${allParams}`} className="text-primary hover:underline">
          Восстановить
        </Link>
      </p>

      {/* ACTIONS */}
      <div className="flex gap-4">
        <Button asChild variant="outline" className="w-1/2">
          <Link href={`/create-account${allParams}`}>Регистрация</Link>
        </Button>

        <Button className="w-1/2" disabled={loading} type="submit">
          {loading ? 'Вход…' : 'Войти'}
        </Button>
      </div>
    </form>
  )
}
