'use client'

import { useState, useEffect } from 'react'
import { FilterSidebar } from '@/components/filters/FilterSidebar'
import { SortSelect } from '@/components/filters/SortSelect'
import { MediaGrid } from '@/components/MediaGrid'
import { Pagination } from '@/components/Pagination'

type Props = {
  title: string
  basePath: string
  items: any[]
  page: number
  totalPages: number
  limit: number
  sort: string
  showRating?: boolean
  type?: 'movie' | 'series'
}

export function MediaPageLayout({
  title,
  basePath,
  items,
  page,
  totalPages,
  limit,
  sort,
  showRating,
  type,
}: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [displayItems, setDisplayItems] = useState(items)

  // Обновление элементов при смене сортировки
  useEffect(() => {
    setIsLoading(true)

    const timeout = setTimeout(() => {
      setDisplayItems(items)
      setIsLoading(false)
    }, 400) // небольшая задержка для плавного эффекта

    return () => clearTimeout(timeout)
  }, [items])

  return (
    <div className="container mx-auto py-10 min-h-[70vh]">
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-72 flex-shrink-0">
          <FilterSidebar basePath={basePath} type={type} />
        </aside>

        <main className="flex-1 flex flex-col gap-6">
          <header className="flex flex-wrap gap-4 items-center justify-between">
            <h1 className="text-3xl font-bold">{title}</h1>
            <SortSelect basePath={basePath} value={sort} />
          </header>

          <MediaGrid
            items={displayItems}
            showRating={showRating}
            isLoading={isLoading}
            limit={limit}
          />

          {totalPages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination page={page} totalPages={totalPages} limit={limit} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
