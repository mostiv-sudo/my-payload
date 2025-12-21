// /anime/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Metadata } from 'next'
import { EpisodesSlider } from '@/components/anime/EpisodesSlider'
import { Fragment } from 'react'
import { AnimeComments } from '@/components/anime/AnimeComments'

const statusMap: Record<string, string> = {
  announced: 'Анонс',
  airing: 'Выходит',
  completed: 'Завершено',
}

type Genre = {
  id: number
  title: string
  slug: string
}

type Anime = {
  id: number
  title: string
  title_en?: string
  poster?: string
  poster_url?: string
  rating?: number
  year?: number
  type: 'movie' | 'series'
  status?: string
  duration?: number
  episodesCount?: number
  seasonsCount?: number
  description?: string
  genres?: (number | Genre)[]
  minimal_age: number
  play_link?: string
}

// --- Fetch Anime ---
async function getAnime(slug: string): Promise<Anime | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/anime?where[slug][equals]=${slug}&depth=1`,
      { cache: 'no-store' },
    )
    if (!res.ok) return null
    const data = await res.json()
    return data?.docs?.[0] || null
  } catch (err) {
    console.error('Failed to fetch anime:', err)
    return null
  }
}

// --- Genres ---
function extractGenreIds(genres: (number | Genre)[]): number[] {
  return genres
    .map((g) => (typeof g === 'number' ? g : g?.id))
    .filter((id): id is number => Boolean(id))
}

async function getGenresByIds(ids: number[]): Promise<Genre[]> {
  if (!ids?.length) return []
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/genres?where[id][in]=${ids.join(',')}`,
      { cache: 'no-store' },
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.docs || []
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params // <-- обязательно await
  const anime = await getAnime(slug)
  if (!anime) return {}

  const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')

  return {
    title: anime.title,
    description:
      anime.description ||
      `Смотрите ${anime.type === 'movie' ? 'фильм' : 'сериал'} ${anime.title_en || ''}`,
    metadataBase,
    openGraph: {
      title: anime.title,
      description: anime.description || '',
      images: [{ url: anime.poster || '/placeholder.jpg', width: 800, height: 600 }],
    },
  }
}

// --- Страница ---
type Params = { params: { slug: string } }

export default async function AnimeDetailsPage({ params }: Params) {
  const { slug } = await params
  const anime = await getAnime(slug)
  if (!anime) return notFound()

  const genreIds = extractGenreIds(anime.genres || [])
  const genres = await getGenresByIds(genreIds)

  return (
    <div className="lg:container mx-auto px-4 py-8 mt-20 space-y-8">
      {/* Карточка аниме */}
      <Card className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/80 dark:bg-background/50 backdrop-blur-md shadow-sm dark:shadow-black/20 hover:shadow-md transition-all">
        <CardContent className="flex flex-col lg:flex-row gap-8 p-6 lg:p-10">
          <div className="w-full lg:w-1/3 max-w-sm mx-auto">
            {anime.poster_url ? (
              <Image
                src={anime.poster_url}
                alt={anime.title}
                width={500}
                height={700}
                className="rounded-2xl shadow-md object-cover"
              />
            ) : (
              <div className="h-[700px] w-full rounded-2xl bg-muted animate-pulse" />
            )}
          </div>

          <div className="flex-1 space-y-5 text-foreground">
            {/* Заголовки */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">{anime.title}</h1>
              {anime.title_en && (
                <p className="text-muted-foreground italic mt-1">{anime.title_en}</p>
              )}
            </div>

            {/* Рейтинг */}
            {anime.rating && (
              <div className="flex items-center gap-3">
                <div className="text-4xl font-black text-yellow-400">{anime.rating}</div>
                <span className="text-sm text-muted-foreground">рейтинг пользователей</span>
              </div>
            )}

            {/* Основная информация */}
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <Fragment>
                <span>{anime.year || '—'} год</span>•
                <span>{anime.type === 'movie' ? 'Фильм' : 'Сериал'}</span>•
                <span>{anime.status ? statusMap[anime.status] : '—'}</span>
                {anime.minimal_age !== undefined && (
                  <>
                    •<span>{anime.minimal_age}+</span>
                  </>
                )}
                {anime.type === 'movie' && anime.duration && (
                  <>
                    •<span>{anime.duration} мин.</span>
                  </>
                )}
                {anime.type === 'series' && (
                  <>
                    {anime.episodesCount && (
                      <>
                        •<span>{anime.episodesCount} серий</span>
                      </>
                    )}
                    {anime.seasonsCount && (
                      <>
                        •<span>{anime.seasonsCount} сезонов</span>
                      </>
                    )}
                  </>
                )}
              </Fragment>
            </div>

            {/* Жанры */}
            {genres.length > 0 && (
              <div className="pt-2 flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Link
                    key={genre.slug}
                    href={`/genre/${genre.slug}`}
                    className="px-3 py-1 text-sm rounded-full border border-border/60 bg-background/60 backdrop-blur hover:bg-primary hover:text-primary-foreground transition"
                  >
                    {genre.title}
                  </Link>
                ))}
              </div>
            )}

            {/* Действия */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
                Смотреть
              </Button>
              <Button variant="outline">Трейлер</Button>
            </div>

            {/* Описание */}
            <div className="pt-4">
              <h2 className="text-xl font-semibold mb-2">Описание</h2>
              <p className="text-muted-foreground leading-relaxed">
                {anime.description || 'Описание отсутствует.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Видео или эпизоды */}
      {anime.type === 'movie' ? (
        anime.play_link ? (
          <div className="mt-8 space-y-3 transition-opacity duration-300">
            <h3 className="text-lg font-semibold">Фильм</h3>
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border/60 shadow-lg">
              <iframe
                src={anime.play_link}
                title={anime.title}
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        ) : (
          <p className="mt-8 text-muted-foreground">Ссылка на видео отсутствует.</p>
        )
      ) : (
        anime.id && <EpisodesSlider animeId={anime.id} />
      )}

      {/* Комментарии */}
      {anime.id && <AnimeComments animeId={anime.id} />}

      {/* Ссылка назад */}
      <Link
        href="/anime"
        className="inline-flex items-center text-sm mt-4 text-muted-foreground hover:text-foreground"
      >
        ← Назад ко всем аниме
      </Link>
    </div>
  )
}
