// components/Pagination.tsx
import Link from 'next/link'

type Props = {
  page: number
  totalPages: number
  limit: number
}

function buildPages(page: number, totalPages: number) {
  const pages = new Set<number | 'dots'>()

  pages.add(1)

  if (page > 3) pages.add('dots')

  if (page > 1) pages.add(page - 1)
  pages.add(page)
  if (page < totalPages) pages.add(page + 1)

  if (page < totalPages - 2) pages.add('dots')

  if (totalPages > 1) pages.add(totalPages)

  return Array.from(pages)
}

export function Pagination({ page, totalPages, limit }: Props) {
  if (totalPages <= 1) return null

  const pages = buildPages(page, totalPages)

  return (
    <div className="flex items-center justify-center gap-1 mt-10 ">
      {/* PREV */}
      <Link
        href={`?page=${page - 1}&limit=${limit}`}
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
            href={`?page=${p}&limit=${limit}`}
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
        href={`?page=${page + 1}&limit=${limit}`}
        className={`px-3 py-1 rounded-md border text-sm ${
          page === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-muted'
        }`}
      >
        →
      </Link>
    </div>
  )
}
