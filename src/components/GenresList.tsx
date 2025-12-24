'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'

// Скелетон для загрузки
function GenreSkeleton() {
  return (
    <Card className="animate-pulse bg-gray-300 dark:bg-gray-700 w-36 h-36 rounded-lg shadow-md">
      <CardContent className="flex items-center justify-center"></CardContent>
    </Card>
  )
}

type Genre = {
  id: number
  title: string
  slug: string
}

type Props = {
  limit?: number
  selectedSlug?: string
}

export function GenresList({ limit, selectedSlug }: Props) {
  const [genres, setGenres] = useState<Genre[]>([])
  const [api, setApi] = useState<CarouselApi>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/genres?limit=1000`)
        if (!res.ok) throw new Error('Ошибка при загрузке жанров')
        const data = await res.json()
        const sorted = (data.docs || []).sort((a: Genre, b: Genre) =>
          a.title.localeCompare(b.title, 'ru', { sensitivity: 'base' }),
        )
        setGenres(sorted)
      } catch (err) {
        console.error(err)
        setGenres([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchGenres()
  }, [])

  // Автопрокрутка каждые 3 сек
  useEffect(() => {
    if (!api) return
    const interval = setInterval(() => {
      api.scrollNext()
    }, 3000)
    return () => clearInterval(interval)
  }, [api])

  const displayedGenres = limit ? genres.slice(0, limit) : genres

  return (
    <div>
      <header className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Жанры</h2>
      </header>

      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto py-2">
          {Array.from({ length: limit || 10 }).map((_, i) => (
            <GenreSkeleton key={i} />
          ))}
        </div>
      ) : displayedGenres.length ? (
        <Carousel className="w-full py-2 relative">
          <CarouselContent className="-ml-4 flex gap-2 p-2">
            {displayedGenres.map((g) => (
              <CarouselItem key={g.id} className="pl-2 md:basis-auto">
                <Link href={`/genres/${g.slug}`} passHref>
                  <Card
                    className={`transition-transform duration-300 hover:scale-105 cursor-pointer rounded-lg shadow-md
                      ${
                        selectedSlug === g.slug
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100'
                      }`}
                  >
                    <CardContent className="flex items-center justify-center px-4 py-2 text-center text-sm font-medium whitespace-nowrap w-36 h-36 md:w-40 md:h-40">
                      {g.title}
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-900 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <span className="text-lg font-bold text-gray-800 dark:text-gray-100">‹</span>
          </CarouselPrevious>
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-900 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <span className="text-lg font-bold text-gray-800 dark:text-gray-100">›</span>
          </CarouselNext>
        </Carousel>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">Жанры не найдены</p>
      )}
    </div>
  )
}
