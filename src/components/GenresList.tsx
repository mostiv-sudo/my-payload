'use client'
import { useEffect, useState } from 'react'
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
    <Card className="animate-pulse bg-gray-300 dark:bg-gray-700 w-40 h-40 rounded-lg shadow-md">
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
  onSelect?: (slug: string) => void
  limit?: number
}

export function GenresList({ onSelect, limit }: Props) {
  const [genres, setGenres] = useState<Genre[]>([])
  const [selected, setSelected] = useState<string | null>(null)
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

  const handleSelect = (slug: string) => {
    setSelected(slug)
    onSelect?.(slug)
  }

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
          <CarouselContent className="-ml-4 flex gap-1 p-4">
            {displayedGenres.map((g) => (
              <CarouselItem key={g.id} className="pl-4 md:basis-auto">
                <Card
                  className={`transition-transform duration-300 hover:scale-105 cursor-pointer rounded-lg shadow-md ${
                    selected === g.slug
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100'
                  }`}
                  onClick={() => handleSelect(g.slug)}
                >
                  <CardContent className="flex items-center justify-center px-4 py-2 text-center text-sm font-medium whitespace-nowrap w-40 h-40">
                    {g.title}
                  </CardContent>
                </Card>
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
