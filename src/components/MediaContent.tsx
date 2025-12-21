'use client'

import { useEffect, useState } from 'react'
import { AnimeGridSkeleton } from '@/components/anime/AnimeGridSkeleton'
import { AnimeSwiper } from '@/components/anime/AnimeSwiper'
import { HeroAnime } from '@/components/HeroAnime'
import { getMedia, resolveGenreIds } from '@/lib/getMedia'
import type { MediaFilters, SortType, MediaEndpoint } from '@/lib/types'

type Props = {
  title?: string
  endpoint?: MediaEndpoint
  limit?: number
  filters?: MediaFilters
  sort?: SortType
  showHero?: boolean
}

export function MediaContent({
  title = 'Контент',
  endpoint = 'anime',
  limit = 40,
  filters,
  sort = 'rating_desc',
  showHero = false,
}: Props) {
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const fetchData = async () => {
      setIsLoading(true)

      try {
        let resolvedFilters = filters

        // 🔁 slug → genreId (ТОЛЬКО если реально есть slug)
        if (filters?.genres?.some((g) => typeof g === 'string')) {
          const slugs = filters.genres.filter((g): g is string => typeof g === 'string')

          const ids = await resolveGenreIds(slugs)

          resolvedFilters = {
            ...filters,
            genres: ids,
          }
        }

        const { items } = await getMedia(endpoint, {
          page: 1,
          limit,
          sort,
          filters: resolvedFilters,
        })

        if (!cancelled) setItems(items)
      } catch (err) {
        if (!cancelled) {
          console.error('MediaContent error:', err)
          setItems([])
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [endpoint, limit, sort, JSON.stringify(filters)])

  const hero = showHero ? items[0] : null
  const popular = showHero ? items.slice(1, 12) : items.slice(0, 12)
  const fresh = items.slice(showHero ? 12 : 0)

  return (
    <div className="flex flex-col gap-10">
      {/* HERO */}
      {showHero &&
        (isLoading ? <AnimeGridSkeleton count={1} /> : hero && <HeroAnime anime={hero} />)}
      <header>
        <h2 className="text-3xl font-bold">{title}</h2>
      </header>
      {/* POPULAR */}
      <section>
        {isLoading ? <AnimeGridSkeleton count={6} /> : <AnimeSwiper items={popular} />}
      </section>
    </div>
  )
}
