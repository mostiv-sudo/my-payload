'use client'

import React, { useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'

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

  const [error, setError] = React.useState<string | null>(null)

  const {
    formState: { errors, isLoading },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        await login(data)
        router.push(redirect.current || '/account')
      } catch {
        setError('There was an error with the credentials provided. Please try again.')
      }
    },
    [login, router],
  )

  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''

  return (
    <form className="space-y-10" onSubmit={handleSubmit(onSubmit)}>
      {/** Global error message */}
      <Message error={error} className="mb-4" />

      <div className="flex flex-col gap-8">
        {/** EMAIL */}
        <FormItem>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register('email', { required: 'Email is required.' })}
          />
          {errors.email && <FormError message={errors.email.message} />}
        </FormItem>

        {/** PASSWORD */}
        <FormItem>
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register('password', { required: 'Please provide a password.' })}
          />
          {errors.password && <FormError message={errors.password.message} />}
        </FormItem>

        <div className="text-primary/70 prose prose-a:no-underline prose-a:hover:text-primary dark:prose-invert">
          <p>
            Forgot your password?{' '}
            <Link href={`/recover-password${allParams}`}>Click here to reset it</Link>
          </p>
        </div>
      </div>

      {/** ACTION BUTTONS */}
      <div className="flex gap-4 justify-between">
        <Button asChild variant="outline" size="lg">
          <Link href={`/create-account${allParams}`} className="grow max-w-[50%]">
            Регистрация
          </Link>
        </Button>

        <Button className="grow" size="lg" disabled={isLoading} type="submit">
          {isLoading ? 'Обработка...' : 'Войти'}
        </Button>
      </div>
    </form>
  )
}
