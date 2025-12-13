import Link from 'next/link'

export type Anime = {
  id: string
  slug: string
  title: string
  poster?: string
  rating?: number
  year?: number
  type?: 'movie' | 'series'
}

type AnimeCardProps = {
  anime: Anime
}
export function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <Link
      href={`/anime/${anime.slug}`}
      className="
        group relative flex flex-col
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:scale-[1.03]
      "
    >
      {/* POSTER */}
      <div
        className="
          relative w-full overflow-hidden rounded-2xl
          border border-border/60
          bg-background/70
          backdrop-blur-md
          supports-[backdrop-filter]:bg-background/50
          shadow-sm hover:shadow-md
          transition-all
        "
      >
        <img
          src={anime.poster || '/placeholder.jpg'}
          alt={anime.title}
          className="
            w-full h-[260px] object-cover
            transition-transform duration-500 ease-out
            group-hover:scale-110
          "
        />

        {/* OVERLAY */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-t
            from-black/70 via-black/20 to-transparent
            opacity-0 group-hover:opacity-100
            transition-opacity
          "
        />

        {/* RATING */}
        {anime.rating && (
          <span
            className="
              absolute top-2 left-2 z-10
              rounded-full px-2 py-1 text-xs font-semibold
              bg-black/70 text-white backdrop-blur
            "
          >
            ⭐ {anime.rating}
          </span>
        )}
      </div>

      {/* TEXT */}
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-semibold truncate text-foreground group-hover:text-primary transition-colors">
          {anime.title}
        </h3>

        <p className="text-xs text-muted-foreground">
          {anime.type === 'movie' ? 'Фильм' : 'Сериал'}
          {anime.year && ` • ${anime.year}`}
        </p>
      </div>
    </Link>
  )
}

export function AnimeSection({ title, items }: { title: string; items: any[] }) {
  return (
    <section className="mb-14">
      <h2 className="mb-6 text-3xl font-bold md:text-4xl">
        <span className="bg-gradient-to-r from-sky-400 to-emerald-500 bg-clip-text text-transparent">
          {title}
        </span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {items.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    </section>
  )
}
