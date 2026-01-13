import Link from 'next/link'
import Image from 'next/image'
import clsx from 'clsx'
import { Episode } from '@/lib/types'

interface Props {
  episode: Episode
  highlight?: boolean
}

export function EpisodeCard({ episode, highlight }: Props) {
  const time = episode.released
    ? new Date(episode.released).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  return (
    <Link
      href={`/anime/${episode.anime.slug}?episode=${episode.episodeNumber}`}
      title={`${episode.anime.title} — серия ${episode.episodeNumber}`}
      className={clsx(
        'group flex gap-4 rounded-xl border bg-background p-4 transition hover:shadow-md hover:-translate-y-0.5',
        highlight && 'ring-2 ring-primary',
      )}
    >
      <Image
        src={episode.anime.poster_url}
        alt={episode.anime.title}
        width={80}
        height={100}
        className="rounded-md object-cover w-20 h-[110px]"
        sizes="80px"
      />

      <div className="flex flex-col justify-between">
        <div>
          <div className="font-semibold leading-snug group-hover:text-primary">
            {episode.anime.title}
          </div>

          <div className="mt-1 text-sm text-muted-foreground">Серия {episode.episodeNumber}</div>

          {time && (
            <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
              ⏰ {time}
            </div>
          )}
        </div>

        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {episode.anime.rating > 0 && (
            <span className="rounded-md bg-green-100 text-green-800 px-2 py-1 font-medium">
              ⭐ {episode.anime.rating}
            </span>
          )}

          {episode.anime.minimal_age && (
            <span className="rounded-md bg-yellow-100 text-yellow-800 px-2 py-1 font-medium">
              {episode.anime.minimal_age}+
            </span>
          )}

          {episode.anime.status === 'airing' && (
            <span className="rounded-md bg-blue-100 text-blue-800 px-2 py-1 font-medium">
              Выходит
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
