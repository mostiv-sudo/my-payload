'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { MediaGrid } from '@/components/MediaGrid'
import { getAnime } from '@/lib/getAnime'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MediaItem } from '@/lib/types'

export default function GenrePageClient() {
  const pathname = usePathname() || ''
  const searchParams = useSearchParams()
  const router = useRouter()

  const genreSlug = pathname.split('/').at(-1) || ''
  const typeFromUrl = (searchParams.get('type') as 'movie' | 'series') || 'series'
  const pageFromUrl = Number(searchParams.get('page') || 1)

  const [type, setType] = useState<'movie' | 'series'>(typeFromUrl)
  const [page, setPage] = useState<number>(pageFromUrl)
  const [items, setItems] = useState<MediaItem[]>([])
  const [totalPages, setTotalPages] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Синхронизация state с URL
  useEffect(() => {
    if (type !== typeFromUrl) setType(typeFromUrl)
    if (page !== pageFromUrl) setPage(pageFromUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFromUrl, pageFromUrl])

  const fetchData = useCallback(async () => {
    if (!genreSlug) return
    setIsLoading(true)
    try {
      const data = await getAnime({
        page,
        filters: { genres: [genreSlug], type },
      })
      setItems(data.items)
      setTotalPages(data.totalPages)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [genreSlug, type, page])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const updateUrl = (newType: 'movie' | 'series', newPage: number) => {
    router.push(`/genres/${genreSlug}?type=${newType}&page=${newPage}`, { scroll: false })
  }

  const handleTypeChange = (newType: 'movie' | 'series') => {
    setType(newType)
    setPage(1)
    updateUrl(newType, 1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    updateUrl(type, newPage)
  }

  return (
    <div className="py-6 px-4 md:px-8 container">
      <h1 className="text-3xl font-bold mb-6 capitalize">{genreSlug}</h1>

      {/* Переключатель Фильмы / Сериалы */}
      <div className="flex gap-3 mb-6">
        <Button
          variant={type === 'series' ? 'default' : 'outline'}
          onClick={() => handleTypeChange('series')}
          className="transition-transform duration-200 hover:scale-105"
        >
          Сериалы
        </Button>
        <Button
          variant={type === 'movie' ? 'default' : 'outline'}
          onClick={() => handleTypeChange('movie')}
          className="transition-transform duration-200 hover:scale-105"
        >
          Фильмы
        </Button>
      </div>

      {/* Сетка аниме */}
      <MediaGrid
        items={items}
        isLoading={isLoading}
        showRating
        limit={25}
        cols={{ base: 2, xl: 5 }}
      />

      {/* Пагинация */}
      <div className="flex justify-center gap-4 mt-8">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1 || isLoading}
          onClick={() => handlePageChange(page - 1)}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Назад
        </Button>

        <span className="px-4 py-1 rounded-md border flex items-center justify-center">
          {page} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages || isLoading}
          onClick={() => handlePageChange(page + 1)}
          className="flex items-center gap-1"
        >
          Вперёд <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
