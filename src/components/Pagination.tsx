'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

type Props = {
  page: number
  totalPages: number
  limit: number
}

/**
 * Генерация массива страниц с "dots" для пропусков
 */
function buildPages(current: number, total: number): (number | 'dots')[] {
  const pages: (number | 'dots')[] = []

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }

  pages.push(1)
  if (current > 3) pages.push('dots')
  if (current > 2) pages.push(current - 1)
  if (current !== 1 && current !== total) pages.push(current)
  if (current < total - 1) pages.push(current + 1)
  if (current < total - 2) pages.push('dots')
  pages.push(total)

  return pages
}

export function Pagination({ page, totalPages, limit }: Props) {
  const searchParams = useSearchParams()
  if (totalPages <= 1) return null

  const pages = buildPages(page, totalPages)

  // Создаём URLSearchParams, удаляем старую страницу и добавляем limit
  const currentParams = new URLSearchParams(searchParams?.toString() ?? '')
  currentParams.set('limit', String(limit))
  currentParams.delete('page') // чтобы не было дублирования

  const buildHref = (p: number) => `?${currentParams.toString()}&page=${p}`

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      {/* PREV */}
      <Link
        href={buildHref(Math.max(page - 1, 1))}
        className={`px-3 py-1 rounded-md border text-sm ${
          page === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-muted'
        }`}
      >
        ←
      </Link>

      {pages.map((p, i) =>
        p === 'dots' ? (
          <span key={`dots-${i}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <Link
            key={`page-${p}-${i}`}
            href={buildHref(p)}
            className={`px-3 py-1 rounded-md text-sm ${
              p === page ? 'bg-primary text-primary-foreground' : 'border hover:bg-muted'
            }`}
          >
            {p}
          </Link>
        ),
      )}

      {/* NEXT */}
      <Link
        href={buildHref(Math.min(page + 1, totalPages))}
        className={`px-3 py-1 rounded-md border text-sm ${
          page === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-muted'
        }`}
      >
        →
      </Link>
    </div>
  )
}
