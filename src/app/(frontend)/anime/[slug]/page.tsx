import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

async function getAnime(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/anime?where[slug][equals]=${slug}`,
      { cache: 'no-store' },
    )

    if (!res.ok) return null
    const data = await res.json()
    if (!data?.docs?.length) return null

    return data.docs[0]
  } catch (error) {
    console.error('Ошибка при загрузке аниме:', error)
    return null
  }
}

type Args = {
  params: Promise<{
    slug: string
  }>
}

export default async function AnimeDetailsPage({ params }: Args) {
  const { slug } = await params
  const anime = await getAnime(slug)

  if (!anime) return notFound()

  return (
    <div className="container mx-auto py-8 mt-20">
      {/* MOVIE CARD */}
      <Card className="relative overflow-hidden rounded-3xl shadow-xl bg-black/40 backdrop-blur-xl border-none">
        {/* BLURRED BACKGROUND POSTER */}
        <div className="absolute inset-0">
          <Image
            src={anime.poster || '/placeholder.jpg'}
            alt={anime.title}
            fill
            className="object-cover opacity-40 blur-lg scale-105"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <CardContent className="relative z-10 flex flex-col lg:flex-row gap-8 p-6 lg:p-10">
          {/* POSTER */}
          <div className="w-full lg:w-1/3 max-w-sm mx-auto">
            <Image
              src={anime.poster || '/placeholder.jpg'}
              alt={anime.title}
              width={500}
              height={700}
              className="rounded-2xl shadow-md object-cover"
            />
          </div>

          {/* TEXT CONTENT */}
          <div className="flex-1 text-white space-y-5">
            {/* TITLE */}
            <h1 className="text-3xl lg:text-4xl font-bold">{anime.title}</h1>
            {anime.title_en && <p className="text-gray-300 text-lg italic">{anime.title_en}</p>}

            {/* RATING */}
            {anime.rating && (
              <div className="flex items-center gap-3">
                <div className="text-4xl font-black text-yellow-400">{anime.rating}</div>
                <span className="text-gray-300 text-sm">рейтинг пользователей</span>
              </div>
            )}

            {/* INFO */}
            <div className="flex flex-wrap gap-3 text-gray-300 text-sm pt-2">
              <span>{anime.year || '—'} год</span>
              <span>•</span>
              <span>{anime.type === 'movie' ? 'Фильм' : 'Сериал'}</span>
              <span>•</span>
              <span>{anime.status || '—'}</span>

              {anime.type === 'movie' && anime.duration && (
                <>
                  <span>•</span>
                  <span>{anime.duration} мин.</span>
                </>
              )}

              {anime.type === 'series' && (
                <>
                  {anime.episodesCount && (
                    <>
                      <span>•</span>
                      <span>{anime.episodesCount} серий</span>
                    </>
                  )}
                  {anime.seasonsCount && (
                    <>
                      <span>•</span>
                      <span>{anime.seasonsCount} сезонов</span>
                    </>
                  )}
                </>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 pt-2">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
                Смотреть
              </Button>

              <Button
                variant="outline"
                className=" text-black dark:text-white border-white/20 hover:bg-white/20"
              >
                Трейлер
              </Button>
            </div>

            {/* DESCRIPTION */}
            <div className="pt-4">
              <h2 className="text-xl font-semibold mb-2">Описание</h2>
              <p className="text-gray-200 leading-relaxed">
                {anime.description || 'Описание отсутствует.'}
              </p>
            </div>

            {/* TAGS */}
            <div className="pt-4 flex flex-wrap gap-2">
              <span className="bg-white/10 px-3 py-1 text-sm rounded-full border border-white/10">
                {anime.type === 'movie' ? 'Фильм' : 'Сериал'}
              </span>

              {anime.year && (
                <span className="bg-white/10 px-3 py-1 text-sm rounded-full border border-white/10">
                  {anime.year}
                </span>
              )}

              {anime.rating && (
                <span className="bg-yellow-600 text-black px-3 py-1 text-sm rounded-full flex justify-center items-center">
                  ⭐ {anime.rating}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* BACK BUTTON */}
      <Link
        href="/anime"
        className="inline-flex items-center text-gray-500 hover:text-black mb-6 text-sm mt-4"
      >
        ← Назад ко всем аниме
      </Link>
    </div>
  )
}
