import { useEffect, useMemo, useState } from 'react'
import { AnimeGridSkeleton } from '@/components/anime/AnimeGridSkeleton'
import { AnimeSwiper } from '@/components/anime/AnimeSwiper'
import { HeroAnime } from '@/components/HeroAnime'
import { getMedia, getAnimeBySlug, resolveGenreIds } from '@/lib/getMedia'
import type { MediaFilters, SortType, MediaItem } from '@/lib/types'

type Props = {
  title?: string
  limit?: number
  filters?: MediaFilters
  sort?: SortType
  showHero?: boolean
  heroSlug?: string // <-- новый проп
}

export function MediaContent({
  title = 'Контент',
  limit = 25,
  filters,
  sort = 'rating_desc',
  showHero = false,
  heroSlug,
}: Props) {
  const [items, setItems] = useState<MediaItem[]>([])
  const [heroItem, setHeroItem] = useState<MediaItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const stableFilters = useMemo(() => filters, [filters])

  useEffect(() => {
    let cancelled = false

    async function fetchMedia() {
      setIsLoading(true)
      try {
        let resolvedFilters = stableFilters

        if (stableFilters?.genres?.some((g) => typeof g === 'string')) {
          const slugs = stableFilters.genres.filter((g): g is string => typeof g === 'string')
          const ids = await resolveGenreIds(slugs)
          resolvedFilters = { ...stableFilters, genres: ids }
        }

        const { items: mediaItems } = await getMedia({
          page: 1,
          limit,
          sort,
          filters: resolvedFilters,
        })

        if (!cancelled) {
          setItems(mediaItems)

          // Если указан heroSlug, подтягиваем именно этот anime
          if (heroSlug) {
            const hero = await getAnimeBySlug(heroSlug)
            setHeroItem(hero || mediaItems[0] || null)
          } else {
            setHeroItem(mediaItems[0] || null)
          }
        }
      } catch (error) {
        if (!cancelled) {
          console.error('MediaContent error:', error)
          setItems([])
          setHeroItem(null)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchMedia()

    return () => {
      cancelled = true
    }
  }, [limit, sort, stableFilters, heroSlug])

  const popularItems = heroItem
    ? items.filter((i) => i.id !== heroItem.id).slice(0, 12)
    : items.slice(0, 12)

  return (
    <div className="flex flex-col gap-10">
      {/* HERO */}
      {showHero &&
        (isLoading ? <AnimeGridSkeleton count={1} /> : heroItem && <HeroAnime anime={heroItem} />)}

      <header>
        <h2 className="text-3xl font-bold">{title}</h2>
      </header>

      {/* POPULAR */}
      <section>
        {isLoading ? <AnimeGridSkeleton count={6} /> : <AnimeSwiper items={popularItems} />}
      </section>
    </div>
  )
}
