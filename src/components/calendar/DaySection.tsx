import clsx from 'clsx'
import { EpisodeCard } from './EpisodeCard'
import { Episode } from '@/lib/types'

interface Props {
  date: string
  episodes: Episode[]
  todayISO: string
}

export function DaySection({ date, episodes, todayISO }: Props) {
  const isToday = date === todayISO
  const dateObj = new Date(date)
  const now = Date.now()

  const sorted = [...episodes].sort(
    (a, b) => new Date(a.released).getTime() - new Date(b.released).getTime(),
  )

  const nextEpisodeId = isToday
    ? sorted.find((e) => new Date(e.released).getTime() > now)?.id
    : null

  return (
    <section
      className={clsx(
        'rounded-xl sm:rounded-2xl border p-3 sm:p-5 space-y-3',
        isToday ? 'border-primary/60 bg-primary/5' : 'bg-card',
      )}
    >
      <header className="flex items-center justify-between">
        <h2 className="text-sm sm:text-lg font-semibold capitalize">
          {dateObj.toLocaleDateString('ru-RU', {
            weekday: 'short',
            day: 'numeric',
            month: 'long',
          })}
        </h2>

        {isToday && (
          <span className="text-[10px] sm:text-xs rounded-full bg-primary text-primary-foreground px-2 py-0.5">
            Сегодня
          </span>
        )}
      </header>

      {sorted.length === 0 ? (
        <div className="text-xs sm:text-sm text-muted-foreground italic">— релизов нет —</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((ep) => (
            <EpisodeCard key={ep.id} episode={ep} highlight={ep.id === nextEpisodeId} />
          ))}
        </div>
      )}
    </section>
  )
}
