import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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
  } catch {
    return null
  }
}

type Args = {
  params: Promise<{ slug: string }>
}

export default async function AnimeDetailsPage({ params }: Args) {
  const { slug } = await params
  const anime = await getAnime(slug)

  if (!anime) return notFound()

  return (
    <div className="container mx-auto py-8 mt-20">
      {/* CARD */}
      <Card
        className="
          relative overflow-hidden rounded-3xl
          border border-border/60
          bg-background/80 dark:bg-background/50
          backdrop-blur-md
          supports-[backdrop-filter]:bg-background/60
          dark:supports-[backdrop-filter]:bg-background/40
          shadow-sm dark:shadow-black/20
          hover:shadow-md transition-all
        "
      >
        <CardContent className="flex flex-col lg:flex-row gap-8 p-6 lg:p-10">
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

          {/* CONTENT */}
          <div className="flex-1 space-y-5 text-foreground">
            {/* TITLE */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">{anime.title}</h1>
              {anime.title_en && (
                <p className="text-muted-foreground italic mt-1">{anime.title_en}</p>
              )}
            </div>

            {/* RATING */}
            {anime.rating && (
              <div className="flex items-center gap-3">
                <div className="text-4xl font-black text-yellow-400">{anime.rating}</div>
                <span className="text-sm text-muted-foreground">рейтинг пользователей</span>
              </div>
            )}

            {/* INFO */}
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
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

            {/* ACTIONS */}
            <div className="flex gap-3 pt-2">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
                Смотреть
              </Button>

              <Button variant="outline">Трейлер</Button>
            </div>

            {/* DESCRIPTION */}
            <div className="pt-4">
              <h2 className="text-xl font-semibold mb-2">Описание</h2>
              <p className="text-muted-foreground leading-relaxed">
                {anime.description || 'Описание отсутствует.'}
              </p>
            </div>

            {/* TAGS */}
            <div className="pt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 text-sm rounded-full border bg-muted text-foreground">
                {anime.type === 'movie' ? 'Фильм' : 'Сериал'}
              </span>

              {anime.year && (
                <span className="px-3 py-1 text-sm rounded-full border bg-muted text-foreground">
                  {anime.year}
                </span>
              )}

              {anime.rating && (
                <span className="px-3 py-1 text-sm rounded-full bg-yellow-500 text-black font-medium">
                  ⭐ {anime.rating}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* BACK */}
      <Link
        href="/anime"
        className="inline-flex items-center text-sm mt-4 text-muted-foreground hover:text-foreground"
      >
        ← Назад ко всем аниме
      </Link>
    </div>
  )
}
