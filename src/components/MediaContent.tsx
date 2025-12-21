'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimeGridSkeleton } from '@/components/anime/AnimeGridSkeleton'
import { AnimeSwiper } from '@/components/anime/AnimeSwiper'
import { HeroAnime } from '@/components/HeroAnime'
import { getMedia, resolveGenreIds } from '@/lib/getMedia'
import type { MediaFilters, SortType, MediaItem } from '@/lib/types'

type Props = {
  title?: string
  limit?: number
  filters?: MediaFilters
  sort?: SortType
  showHero?: boolean
}

/**
 * Клиентский компонент загрузки и отображения контента
 * Работает с коллекцией `anime`
 */
export function MediaContent({
  title = 'Контент',
  limit = 40,
  filters,
  sort = 'rating_desc',
  showHero = false,
}: Props) {
  const [items, setItems] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Стабилизируем фильтры для useEffect
   */
  const stableFilters = useMemo(() => filters, [filters])

  useEffect(() => {
    let cancelled = false

    async function fetchMedia() {
      setIsLoading(true)

      try {
        let resolvedFilters = stableFilters

        /**
         * slug → genreId
         */
        if (stableFilters?.genres?.some((g) => typeof g === 'string')) {
          const slugs = stableFilters.genres.filter((g): g is string => typeof g === 'string')

          const ids = await resolveGenreIds(slugs)

          resolvedFilters = {
            ...stableFilters,
            genres: ids,
          }
        }

        const { items } = await getMedia({
          page: 1,
          limit,
          sort,
          filters: resolvedFilters,
        })

        if (!cancelled) setItems(items)
      } catch (error) {
        if (!cancelled) {
          console.error('MediaContent error:', error)
          setItems([])
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchMedia()

    return () => {
      cancelled = true
    }
  }, [limit, sort, stableFilters])

  /**
   * Разделение данных для UI
   */
  const heroItem = showHero ? items[0] : null
  const popularItems = showHero ? items.slice(1, 12) : items.slice(0, 12)

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
