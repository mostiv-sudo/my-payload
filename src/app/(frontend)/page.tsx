import Link from 'next/link'

async function getAnime(limit = 6) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/anime?limit=${limit}`)
  const data = await res.json()
  return data.docs
}

export default async function AnimePage() {
  const animeList = await getAnime()

  return (
    <div className="mx-auto px-1 max-w-7xl mt-30">
      <h1 className="mb-4 text-3xl font-bold text-heading md:text-5xl lg:text-6xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
          Самое популярное
        </span>
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4">
        {animeList.map((anime: any) => (
          <Link
            key={anime.id}
            href={`/anime/${anime.slug}`}
            className="flex flex-col justify-start relative overflow-hidden"
          >
            {/* POSTER */}
            <div
              className="flex flex-row
    justify-center
    items-center
    w-full
    rounded-2xl
    overflow-hidden
    relative
    z-[1]"
            >
              <img
                src={anime.poster || '/placeholder.jpg'}
                alt={anime.title}
                className="w-full h-full object-cover rounded-xl group-hover:opacity-60 transition"
              />

              {/* RATING */}
              {anime.rating && (
                <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur">
                  {anime.rating}
                </span>
              )}
            </div>

            {/* TEXT */}
            <h3 className="text-sm font-semibold text-white mt-4 truncate px-1 ">{anime.title}</h3>

            <ul className="flex gap-2 text-gray-400 text-[16px] px-1 pb-2">
              <li>{anime.type}</li>
              <li>{anime.year}</li>
            </ul>
          </Link>
        ))}
      </div>

      <h1 className="mb-4 text-3xl font-bold text-heading md:text-5xl lg:text-6xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
          Новые
        </span>
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4">
        {animeList.map((anime: any) => (
          <Link
            key={anime.id}
            href={`/anime/${anime.slug}`}
            className="flex flex-col justify-start relative overflow-hidden"
          >
            {/* POSTER */}
            <div
              className="flex flex-row
    justify-center
    items-center
    w-full
    rounded-2xl
    overflow-hidden
    relative
    z-[1]"
            >
              <img
                src={anime.poster || '/placeholder.jpg'}
                alt={anime.title}
                className="w-full h-full object-cover rounded-xl group-hover:opacity-60 transition"
              />

              {/* RATING */}
              {anime.rating && (
                <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur">
                  {anime.rating}
                </span>
              )}
            </div>

            {/* TEXT */}
            <h3 className="text-sm font-semibold text-white mt-4 truncate px-1 ">{anime.title}</h3>

            <ul className="flex gap-2 text-gray-400 text-[16px] px-1 pb-2">
              <li>{anime.type}</li>
              <li>{anime.year}</li>
            </ul>
          </Link>
        ))}
      </div>
    </div>
  )
}
