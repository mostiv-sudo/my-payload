'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Clock, ChevronRight } from 'lucide-react'

interface Props {
  from: string
  dates: string[]
  grouped: Record<string, any[]>
}

export function CalendarMiniUI({ from, dates, grouped }: Props) {
  return (
    <Card className="shadow-none border-none p-0 m-0">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-0 mb-5">
        <CardTitle className="text-3xl font-bold tracking-tight">📅 Ближайшие релизы</CardTitle>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 gap-1 px-2 text-muted-foreground hover:text-primary text-xl"
        >
          <Link href="/calendar">
            Все
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-6 px-0">
        {dates.map((date, index) => {
          const dayEpisodes = grouped[date] ?? []
          const dateObj = new Date(date)
          const isToday = date === from

          return (
            <section key={date} className="space-y-3">
              {index > 0 && <Separator className="opacity-40" />}

              {/* День */}
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium capitalize tracking-tight">
                  {dateObj.toLocaleDateString('ru-RU', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })}
                </div>

                {isToday && (
                  <Badge className="bg-primary/10 text-primary text-[10px] px-2 py-0.5">
                    Сегодня
                  </Badge>
                )}
              </div>

              {/* Grid релизов */}
              {dayEpisodes.length === 0 ? (
                <div className="pl-1 text-xs italic text-muted-foreground">— релизов нет —</div>
              ) : (
                <ul
                  className="
                    grid gap-3
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-3
                  "
                >
                  {dayEpisodes.slice(0, 6).map((ep) => (
                    <li key={ep.id}>
                      <Link
                        href={`/anime/${ep.anime.slug}?episode=${ep.episodeNumber}`}
                        className="
                          group block h-full
                          rounded-xl border border-border/40
                          bg-background/70
                          p-3
                          transition-all
                          hover:shadow-md
                          hover:-translate-y-0.5
                          hover:bg-muted/50
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-primary
                        "
                      >
                        {/* Контент карточки */}
                        <div className="flex gap-3">
                          {/* Постер */}
                          <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={ep.anime.poster_url}
                              alt={ep.anime.title}
                              fill
                              sizes="56px"
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>

                          {/* Текст */}
                          <div className="min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="truncate text-sm font-semibold leading-snug group-hover:text-primary transition-colors">
                                {ep.anime.title}
                              </div>

                              <div className="mt-1 text-xs text-muted-foreground">
                                Серия {ep.episodeNumber}
                              </div>
                            </div>

                            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground font-mono">
                              <Clock className="h-3 w-3" />
                              {new Date(ep.released).toLocaleTimeString('ru-RU', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )
        })}
      </CardContent>
    </Card>
  )
}
