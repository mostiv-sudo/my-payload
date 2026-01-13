'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useMemo } from 'react'
import clsx from 'clsx'
import { Skeleton } from '@/components/ui/skeleton'
import type { MediaItem } from '@/lib/types'

type ColsConfig = {
  base?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
}

type Props = {
  items: MediaItem[]
  showRating?: boolean
  limit?: number
  isLoading?: boolean
  cols?: number | ColsConfig
}

/**
 * ⚠️ Tailwind не дружит с динамическими grid-cols-{n}
 * Поэтому используем заранее известные варианты
 */
const GRID_COLS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
}

export function MediaGrid({
  items,
  showRating = true,
  limit = 25,
  isLoading = false,
  cols = { base: 2, sm: 2, lg: 4, xl: 5 },
}: Props) {
  const displayItems = useMemo(() => items.slice(0, limit), [items, limit])

  const gridClasses = useMemo(() => {
    if (typeof cols === 'number') {
      return GRID_COLS[cols] ?? GRID_COLS[2]
    }

    return clsx(
      cols.base && GRID_COLS[cols.base],
      cols.sm && `sm:${GRID_COLS[cols.sm]}`,
      cols.md && `md:${GRID_COLS[cols.md]}`,
      cols.lg && `lg:${GRID_COLS[cols.lg]}`,
      cols.xl && `xl:${GRID_COLS[cols.xl]}`,
    )
  }, [cols])

  return (
    <div className={clsx('grid gap-4 sm:gap-6 min-h-[60vh]', gridClasses)}>
      {isLoading
        ? Array.from({ length: limit }).map((_, idx) => <SkeletonCard key={idx} />)
        : displayItems.map((item) => (
            <MediaCard key={item.id} item={item} showRating={showRating} />
          ))}
    </div>
  )
}

/* ---------------------------------- */
/* 🧱 Карточка */
/* ---------------------------------- */

function MediaCard({ item, showRating }: { item: MediaItem; showRating: boolean }) {
  return (
    <Link
      href={`/anime/${item.slug}`}
      className="group relative flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-muted">
        <Image
          src={item.poster_url || '/placeholder.jpg'}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
        />

        {showRating && item.rating && (
          <span className="absolute top-2 left-2 rounded-full px-2 py-1 text-[11px] font-medium bg-black/70 text-white backdrop-blur">
            ⭐ {item.rating}
          </span>
        )}
      </div>

      <h3 className="mt-2 text-sm font-semibold truncate group-hover:text-primary transition-colors">
        {item.title}
      </h3>

      <p className="text-xs text-muted-foreground">
        {item.type === 'movie' ? 'Фильм' : 'Сериал'}
        {item.year && ` • ${item.year}`}
      </p>
    </Link>
  )
}

/* ---------------------------------- */
/* 🦴 Skeleton */
/* ---------------------------------- */

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      <Skeleton className="w-full aspect-[2/3] rounded-2xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}
