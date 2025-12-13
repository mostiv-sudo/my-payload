import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

import { User, Mail, LogOut, ArrowLeft } from 'lucide-react'

export default async function AccountPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect(
      `/login?warning=${encodeURIComponent(
        'Пожалуйста, войдите в аккаунт, чтобы открыть настройки.',
      )}`,
    )
  }

  return (
    <div>
      <div className="">
        {/* HEADER */}
        <CardHeader className="space-y-3">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <User size={20} />
            </span>
            Профиль аккаунта
          </CardTitle>

          <CardDescription className="text-muted-foreground">
            Управляйте личными данными и настройками безопасности
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* USER INFO */}
          <div
            className="
              rounded-2xl
              border border-border/50
              bg-muted/40
              p-5
              space-y-4
            "
          >
            <InfoRow icon={<User size={16} />} label="ID пользователя" value={user.id.toString()} />

            <Separator />

            <InfoRow icon={<Mail size={16} />} label="Email" value={user.email} />

            {user.username && (
              <>
                <Separator />
                <InfoRow icon={<User size={16} />} label="Имя пользователя" value={user.username} />
              </>
            )}
          </div>

          <Separator />

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <Button variant="outline" asChild className="gap-2">
              <Link href="/">
                <ArrowLeft size={16} />
                На главную
              </Link>
            </Button>

            <Button variant="destructive" asChild className="gap-2">
              <Link href="/logout">
                <LogOut size={16} />
                Выйти из аккаунта
              </Link>
            </Button>
          </div>
        </CardContent>
      </div>
    </div>
  )
}

/* ---------------- helpers ---------------- */

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}
