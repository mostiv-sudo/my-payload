'use client'

import { FilterSidebar } from '@/components/filters/FilterSidebar'
import { SortSelect } from '@/components/filters/SortSelect'
import { MediaGrid } from '@/components/MediaGrid'
import { Pagination } from '@/components/Pagination'
import type { MediaItem } from '@/lib/types'

type Props = {
  title: string
  basePath: string
  items: MediaItem[]
  page: number
  totalPages: number
  limit: number
  sort: string
  showRating?: boolean
  type?: 'movie' | 'series'
  isLoading?: boolean
}

export function MediaPageLayout({
  title,
  basePath,
  items,
  page,
  totalPages,
  limit,
  sort,
  showRating = true,
  type,
  isLoading = false,
}: Props) {
  return (
    <div className="container px-4 py-6 sm:py-10 min-h-[70vh]">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-72 shrink-0 md:sticky md:top-20 h-fit">
          <FilterSidebar basePath={basePath} type={type} />
        </aside>

        {/* Content */}
        <main className="flex-1 flex flex-col gap-6">
          {/* Header */}
          <header className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
            <SortSelect basePath={basePath} value={sort} />
          </header>

          {/* Grid */}
          <MediaGrid items={items} showRating={showRating} limit={limit} isLoading={isLoading} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center pt-2 sm:pt-4">
              <Pagination page={page} totalPages={totalPages} limit={limit} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
