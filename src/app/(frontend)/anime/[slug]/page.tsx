import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Metadata } from 'next'
import { EpisodesList } from '@/components/anime/EpisodesList'
import { EpisodesSlider } from '@/components/anime/EpisodesSlider'

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
}

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
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
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
      images: [
        {
          url: anime.poster || '/placeholder.jpg',
          width: 800,
          height: 600,
        },
      ],
    },
  }
}

type Args = {
  params: Promise<{ slug: string }>
}

export default async function AnimeDetailsPage({ params }: Args) {
  const { slug } = await params
  const anime = await getAnime(slug)
  if (!anime) return notFound()
  const genreIds = extractGenreIds(anime.genres || [])
  const genres = await getGenresByIds(genreIds)

  return (
    <div className="lg:container mx-auto px-4 py-8 mt-20 space-y-8">
      {/* Основной блок с постером и информацией */}
      <Card className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/80 dark:bg-background/50 backdrop-blur-md shadow-sm dark:shadow-black/20 hover:shadow-md transition-all">
        <CardContent className="flex flex-col lg:flex-row gap-8 p-6 lg:p-10">
          <div className="w-full lg:w-1/3 max-w-sm mx-auto">
            <Image
              src={anime.poster || '/placeholder.jpg'}
              alt={anime.title}
              width={500}
              height={700}
              className="rounded-2xl shadow-md object-cover"
            />
          </div>

          <div className="flex-1 space-y-5 text-foreground">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">{anime.title}</h1>
              {anime.title_en && (
                <p className="text-muted-foreground italic mt-1">{anime.title_en}</p>
              )}
            </div>

            {anime.rating && (
              <div className="flex items-center gap-3">
                <div className="text-4xl font-black text-yellow-400">{anime.rating}</div>
                <span className="text-sm text-muted-foreground">рейтинг пользователей</span>
              </div>
            )}

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span>{anime.year || '—'} год</span>
              <span>•</span>
              <span>{anime.type === 'movie' ? 'Фильм' : 'Сериал'}</span>
              <span>•</span>
              <span>{anime.status ? statusMap[anime.status] : '—'}</span>
              {/* Возрастное ограничение */}
              {anime.minimal_age !== undefined && (
                <>
                  <span>•</span>
                  <span>{anime.minimal_age}+</span>
                </>
              )}

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

      {/* Эпизоды для сериалов */}
      {anime.type === 'series' && anime.id && <EpisodesSlider animeId={anime.id} />}

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
