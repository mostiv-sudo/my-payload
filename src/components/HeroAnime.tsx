import Link from 'next/link'

export function HeroAnime({ anime }: { anime: any }) {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden rounded-3xl mb-16">
      {/* BACKGROUND */}
      <img
        src={anime.poster || '/placeholder.jpg'}
        alt={anime.title}
        className="absolute inset-0 h-full w-full object-cover scale-110"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

      {/* CONTENT */}
      <div className="relative z-10 flex h-full items-end p-8 md:p-12">
        <div className="max-w-xl space-y-4">
          <span className="inline-block rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-black">
            ⭐ ТОП РЕЙТИНГ
          </span>

          <h1 className="text-3xl md:text-5xl font-bold text-white">{anime.title}</h1>

          {anime.description && <p className="text-gray-300 line-clamp-3">{anime.description}</p>}

          <div className="flex gap-3 pt-2">
            <Link
              href={`/anime/${anime.slug}`}
              className="rounded-xl bg-yellow-400 px-5 py-2 font-semibold text-black hover:bg-yellow-500 transition"
            >
              Смотреть
            </Link>

            <Link
              href="/anime"
              className="rounded-xl border border-white/20 px-5 py-2 text-white hover:bg-white/10 transition"
            >
              Все аниме
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
