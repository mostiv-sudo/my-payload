'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export type MediaItem = {
  id: string
  slug: string
  poster?: string
  title: string
  type?: 'movie' | 'series'
  year?: number
  rating?: number
}

type Props = {
  items: MediaItem[]
  showRating?: boolean
  limit?: number
  isLoading?: boolean
}

export function MediaGrid({ items, showRating = true, limit = 24, isLoading = false }: Props) {
  const [displayItems, setDisplayItems] = useState<MediaItem[]>(items.slice(0, limit))

  useEffect(() => {
    if (!items) return
    // Добавляем плавное обновление с небольшой задержкой
    const timeout = setTimeout(() => {
      setDisplayItems(items.slice(0, limit))
    }, 200)
    return () => clearTimeout(timeout)
  }, [items, limit]) // зависим только от items и limit, больше никаких новых массивов!

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-6 min-h-[70vh]">
      {isLoading
        ? Array.from({ length: 15 }).map((_, idx) => (
            <div key={idx} className="flex flex-col gap-2 animate-pulse">
              <Skeleton className="w-full h-64 rounded-2xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))
        : displayItems.map((item) => (
            <Link
              key={item.id}
              href={`/anime/${item.slug}`}
              className="group relative flex flex-col transition-transform duration-300 ease-out hover:scale-[1.04]"
            >
              <div className="relative w-full overflow-hidden rounded-2xl">
                <img
                  src={item.poster || '/placeholder.jpg'}
                  alt={item.title}
                  className="w-full h-64 object-cover transition-all duration-300 ease-out group-hover:scale-110 group-hover:opacity-80"
                />
                {showRating && item.rating && (
                  <span className="absolute top-2 left-2 rounded-full px-2 py-1 text-xs bg-black/70 text-white backdrop-blur">
                    ⭐ {item.rating}
                  </span>
                )}
              </div>

              <h3 className="mt-3 text-sm font-semibold truncate transition-colors group-hover:text-primary">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {item.type === 'movie' ? 'Фильм' : 'Сериал'}
                {item.year && ` • ${item.year}`}
              </p>
            </Link>
          ))}
    </div>
  )
}
