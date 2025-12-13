import Link from 'next/link'

export type MediaItem = {
  id: string
  slug: string
  poster?: string
  title: string
  type?: 'movie' | 'series'
  year?: number
  rating?: number
}

type Props = {
  items: MediaItem[]
  showRating?: boolean
  limit?: number
}

export function MediaGrid({ items, showRating = true, limit = 24 }: Props) {
  const visibleItems = items.slice(0, limit)

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-6 min-h-[70vh]">
      {visibleItems.map((item) => (
        <Link key={item.id} href={`/anime/${item.slug}`} className="group flex flex-col relative">
          {/* POSTER */}
          <div className="relative w-full overflow-hidden rounded-2xl">
            <img
              src={item.poster || '/placeholder.jpg'}
              alt={item.title}
              className="w-full h-64 object-cover transition group-hover:opacity-70"
            />

            {/* RATING */}
            {showRating && item.rating && (
              <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur">
                ⭐ {item.rating}
              </span>
            )}
          </div>

          {/* TEXT */}
          <h3 className="text-sm font-semibold mt-3 truncate">{item.title}</h3>

          <p className="text-xs text-muted-foreground">
            {item.type === 'movie' ? 'Фильм' : 'Сериал'}
            {item.year && ` • ${item.year}`}
          </p>
        </Link>
      ))}
    </div>
  )
}
