import { getEpisodesCalendar } from '@/lib/getEpisodesCalendar'
import { groupEpisodesByDate } from '@/lib/groupEpisodesByDate'
import { getWeekDates } from '@/lib/getWeekDates'
import Link from 'next/link'
import clsx from 'clsx'

export const dynamic = 'force-dynamic' // ✅ полностью серверная страница

export default async function CalendarPage() {
  const today = new Date()
  const todayISO = today.toISOString().slice(0, 10)

  const to = new Date(today)
  to.setDate(today.getDate() + 7)

  // Получаем все эпизоды на неделю
  const episodes = await getEpisodesCalendar(todayISO, to.toISOString().slice(0, 10))

  // Группируем по дате релиза
  const grouped = groupEpisodesByDate(episodes)
  const weekDates = getWeekDates()

  return (
    <div className="container py-10 space-y-10">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">📅 Календарь релизов</h1>
        <p className="text-sm text-muted-foreground">Ближайшие релизы на 7 дней</p>
      </header>

      <div className="grid gap-6">
        {weekDates.map((date) => {
          const eps = (grouped[date] ?? []).sort(
            (a, b) => new Date(a.released).getTime() - new Date(b.released).getTime(),
          )

          const isToday = date === todayISO
          const dateObj = new Date(date)

          return (
            <section
              key={date}
              className={clsx(
                'rounded-2xl border p-5 space-y-4 transition-colors',
                isToday ? 'border-primary/60 bg-primary/5' : 'bg-card',
              )}
            >
              <header className="flex items-center justify-between">
                <h2 className="text-lg font-semibold capitalize">
                  {dateObj.toLocaleDateString('ru-RU', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </h2>

                {isToday && (
                  <span className="text-xs rounded-full bg-primary text-primary-foreground px-3 py-1">
                    Сегодня
                  </span>
                )}
              </header>

              {eps.length === 0 ? (
                <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                  Релизов нет
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {eps.map((ep) => {
                    const time = ep.released
                      ? new Date(ep.released).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : null

                    return (
                      <Link
                        key={ep.id}
                        href={`/anime/${ep.anime?.slug}`}
                        className="group flex gap-4 rounded-xl border bg-background p-4 transition hover:shadow-md hover:-translate-y-0.5"
                      >
                        {ep.anime?.poster_url && (
                          <img
                            src={ep.anime.poster_url}
                            alt={ep.anime.title}
                            className="h-20 w-14 rounded-md object-cover"
                          />
                        )}

                        <div className="flex flex-col justify-between">
                          <div>
                            <div className="font-semibold leading-snug group-hover:text-primary">
                              {ep.anime?.title}
                            </div>

                            <div className="mt-1 text-xl text-muted-foreground">
                              Серия {ep.episodeNumber}
                              {time && ` · ${time}`}
                            </div>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-2 text-xs">
                            {ep.anime?.rating > 0 && (
                              <span className="rounded-md bg-green-100 text-green-800 px-2 py-1 font-medium">
                                ⭐ {ep.anime.rating}
                              </span>
                            )}

                            {ep.anime?.minimal_age && (
                              <span className="rounded-md bg-yellow-100 text-yellow-800 px-2 py-1 font-medium">
                                {ep.anime.minimal_age}+
                              </span>
                            )}

                            {ep.anime?.status === 'airing' && (
                              <span className="rounded-md bg-blue-100 text-blue-800 px-2 py-1 font-medium">
                                Выходит
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
