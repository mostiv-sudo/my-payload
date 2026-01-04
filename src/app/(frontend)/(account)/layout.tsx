import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'

import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { User, Mail, Star, Bookmark, Home } from 'lucide-react'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user }: any = await payload.auth({ headers })

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* USER INFO */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold">Информация о пользователе</h2>

        <InfoRow icon={<User size={16} />} label="ID" value={user.id} />
        <Separator />
        <InfoRow icon={<Mail size={16} />} label="Email" value={user.email} />

        {user.username && (
          <>
            <Separator />
            <InfoRow icon={<User size={16} />} label="Имя пользователя" value={user.username} />
          </>
        )}
      </Card>

      {/* NAVIGATION */}
      <Card className="p-3 flex gap-2">
        <NavLink href="/account" icon={<Home size={16} />}>
          Главная
        </NavLink>
        <NavLink href="/account/ratings" icon={<Star size={16} />}>
          Оценки
        </NavLink>
        <NavLink href="/account/bookmarks" icon={<Bookmark size={16} />}>
          Закладки
        </NavLink>
      </Card>

      {/* CONTENT */}
      {children}
    </div>
  )
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm
                 hover:bg-muted transition"
    >
      {icon}
      {children}
    </Link>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="flex items-center gap-2 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
