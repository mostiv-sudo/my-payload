'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { MenuIcon, UserIcon } from 'lucide-react'

import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

import { useAuth } from '@/providers/Auth'

export default function Header() {
  const { user } = useAuth()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  // Закрывать меню при переходах
  useEffect(() => {
    setIsOpen(false)
  }, [pathname, searchParams])

  return (
    <nav className="fixed w-full z-20 top-5 ">
      <div
        className="max-w-3xl mx-4
    flex items-center justify-between
    px-5 py-4
    rounded-full
    border border-border/60
    bg-background/70
    backdrop-blur-md
    supports-[backdrop-filter]:bg-background/50
    shadow-sm
    hover:shadow-md
    transition-all
    md:mx-auto"
      >
        {/* LOGO */}
        <Link href="/" className="text-xl font-semibold text-foreground">
          Аниме
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {/* Если пользователь авторизован */}
          {user ? (
            <Link
              href="/account"
              className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
            >
              <UserIcon className="h-4 w-4" />
              <span>{user.email}</span>
            </Link>
          ) : (
            <Button asChild variant="default">
              <Link href="/login">Вход</Link>
            </Button>
          )}

          {/* Dark/Light Toggle */}
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="p-2 w-9 h-9 flex items-center justify-center rounded-md border border-border hover:bg-accent">
                <MenuIcon className="h-5 w-5" />
              </button>
            </SheetTrigger>

            {/* MOBILE MENU CONTENT */}
            <SheetContent side="right" className="px-4">
              <SheetHeader>
                <SheetTitle>Меню</SheetTitle>
              </SheetHeader>

              <div className="py-4">
                <ul className="flex flex-col gap-2 text-lg">
                  <li>
                    <Link href="/" className="hover:text-primary">
                      Главная
                    </Link>
                  </li>
                  <li>
                    <Link href="/anime" className="hover:text-primary">
                      Каталог
                    </Link>
                  </li>
                  <li>
                    <Link href="/film" className="hover:text-primary">
                      Фильмы
                    </Link>
                  </li>
                  <li>
                    <Link href="/tv" className="hover:text-primary">
                      Сериалы
                    </Link>
                  </li>
                  <li>
                    <Link href="/search" className="hover:text-primary">
                      Поиск
                    </Link>
                  </li>
                </ul>
              </div>

              {/* USER SECTION */}
              {user ? (
                <div className="mt-6">
                  <h2 className="text-xl mb-4">Аккаунт</h2>
                  <ul className="flex flex-col gap-3">
                    <li>
                      <Link href="/account">Профиль</Link>
                    </li>
                    <li>
                      <Link href="/logout">Выйти</Link>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="mt-6">
                  <h2 className="text-xl mb-4">Мой аккаунт</h2>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/login">Войти</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/create-account">Регистрация</Link>
                    </Button>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
