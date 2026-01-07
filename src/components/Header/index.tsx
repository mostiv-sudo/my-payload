'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { MenuIcon, UserIcon } from 'lucide-react'

import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

import { useAuth } from '@/providers/Auth'

const menuItems = [
  { label: 'Главная', href: '/' },
  { label: 'Каталог', href: '/anime' },
  { label: 'Фильмы', href: '/film' },
  { label: 'Сериалы', href: '/tv' },
  { label: 'Жанры', href: '/genres' },
  { label: 'Расписание', href: '/calendar' },
  { label: 'Поиск', href: '/search' },
]

function MenuLinks({ onClick }: { onClick?: () => void }) {
  return (
    <>
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-accent hover:text-primary transition"
          onClick={onClick}
        >
          {item.label}
        </Link>
      ))}
    </>
  )
}

export default function Header() {
  const { user } = useAuth()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  // Закрываем мобильное меню при изменении пути или query
  useEffect(() => {
    setIsOpen(false)
  }, [pathname, searchParams?.toString()])

  const handleClose = useCallback(() => setIsOpen(false), [])

  return (
    <nav className="fixed w-full z-20 top-5">
      <div className="max-w-screen-lg mx-4 md:mx-auto flex items-center justify-between px-5 py-4 rounded-full border border-border/60 bg-background/70 backdrop-blur-md shadow-sm hover:shadow-md transition-all">
        {/* LOGO */}
        <Link href="/" className="text-xl font-semibold text-foreground">
          Аниме
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-2">
          <MenuLinks />
          {user ? (
            <Link
              href="/account"
              className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
            >
              <UserIcon className="h-4 w-4" />
            </Link>
          ) : (
            <Button asChild variant="outline">
              <Link href="/login">Вход</Link>
            </Button>
          )}
          <ThemeToggle />
        </div>

        {/* MOBILE MENU */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="p-2 w-9 h-9 flex items-center justify-center rounded-md border border-border hover:bg-accent">
                <MenuIcon className="h-5 w-5" />
              </button>
            </SheetTrigger>

            <SheetContent side="right" className="px-4">
              <SheetHeader>
                <SheetTitle>Меню</SheetTitle>
              </SheetHeader>

              <ul className="flex flex-col gap-2 text-lg py-4">
                <MenuLinks onClick={handleClose} />
              </ul>

              {/* USER SECTION */}
              <div className="mt-6">
                {user ? (
                  <>
                    <h2 className="text-xl mb-4">Аккаунт</h2>
                    <ul className="flex flex-col gap-3">
                      <li>
                        <Link href="/account" onClick={handleClose}>
                          Профиль
                        </Link>
                      </li>
                      <li>
                        <Link href="/logout" onClick={handleClose}>
                          Выйти
                        </Link>
                      </li>
                    </ul>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl mb-4">Мой аккаунт</h2>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/login" onClick={handleClose}>
                          Войти
                        </Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link href="/create-account" onClick={handleClose}>
                          Регистрация
                        </Link>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
