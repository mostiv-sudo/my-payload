import { getEpisodesCalendar } from '@/lib/getEpisodesCalendar'
import { groupEpisodesByDate } from '@/lib/groupEpisodesByDate'
import { getWeekDates } from '@/lib/getWeekDates'
import Link from 'next/link'
import clsx from 'clsx'

export default async function CalendarPage() {
  const today = new Date()
  const todayISO = today.toISOString().split('T')[0]

  const from = todayISO
  const toDate = new Date()
  toDate.setDate(today.getDate() + 7)
  const to = toDate.toISOString().split('T')[0]

  const episodes = await getEpisodesCalendar(from, to)
  const grouped = groupEpisodesByDate(episodes)
  const weekDates = getWeekDates()

  return (
    <div className="container py-10 space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">📅 Календарь релизов</h1>
        <p className="text-muted-foreground">Расписание выхода серий на ближайшую неделю</p>
      </header>

      <div className="grid gap-6">
        {weekDates.map((date) => {
          const eps = grouped[date] ?? []
          const isToday = date === todayISO

          return (
            <section
              key={date}
              className={clsx(
                'rounded-2xl border p-5 space-y-4 transition',
                isToday ? 'border-primary/60 bg-primary/5' : 'border-border bg-card',
              )}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold capitalize">
                  {new Date(date).toLocaleDateString('ru-RU', {
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
              </div>

              {eps.length === 0 ? (
                <p className="text-sm text-muted-foreground">Релизов нет</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {eps.map((ep: any) => (
                    <Link
                      key={ep.id}
                      href={`/anime/${ep.anime?.slug}`}
                      className="group rounded-xl border bg-background p-4 hover:shadow-lg hover:-translate-y-0.5 transition"
                    >
                      <div className="font-semibold leading-tight group-hover:text-primary">
                        {ep.anime?.title}
                      </div>

                      <div className="mt-2 flex gap-2 text-xs">
                        {ep.anime?.minimal_age && (
                          <span className="rounded-md bg-yellow-100 text-yellow-800 px-2 py-1 font-medium">
                            {ep.anime.minimal_age}+
                          </span>
                        )}
                        <span className="rounded-md bg-muted px-2 py-1">
                          Серия {ep.episodeNumber}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
