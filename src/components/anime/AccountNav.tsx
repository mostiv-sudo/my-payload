'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Film, Bookmark, Star, MessageSquare, User } from 'lucide-react'

const nav = [
  { href: '/account', label: 'Профиль', icon: User },
  { href: '/account/bookmarks', label: 'Отложено', icon: Bookmark },
  { href: '/account/ratings', label: 'Оценки', icon: Star },
  { href: '/account/comments', label: 'Комментарии', icon: MessageSquare },
]

export function AccountNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-wrap gap-2">
      {nav.map(({ href, label, icon: Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition',
              active ? 'bg-primary text-primary-foreground' : 'bg-muted/60 hover:bg-muted',
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
