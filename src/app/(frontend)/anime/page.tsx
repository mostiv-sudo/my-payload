import { MediaGrid } from '@/components/MediaGrid'
import { Pagination } from '@/components/Pagination'
import { getAnime } from '@/lib/getAnime'
import Link from 'next/link'

type SearchParams = {
  sort?: 'rating_desc' | 'rating_asc'
  page?: string
  limit?: string
}

export default async function AnimePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams

  const sort = params.sort ?? 'rating_desc'
  const page = Math.max(1, Number(params.page) || 1)
  const limit = Math.max(1, Number(params.limit) || 24)

  const { items, totalPages } = await getAnime({
    sort,
    page,
    limit,
  })

  return (
    <div className="container mx-auto py-10 mt-20">
      <h1 className="text-3xl font-bold mb-6">Каталог</h1>
      {/* ФИЛЬТРЫ */}
      <div className="flex gap-4 mb-6">
        <Link
          href={`/anime?sort=rating_desc&limit=${limit}`}
          className={sort === 'rating_desc' ? 'font-semibold' : 'text-muted-foreground'}
        >
          Рейтинг ↓
        </Link>

        <Link
          href={`/anime?sort=rating_asc&limit=${limit}`}
          className={sort === 'rating_asc' ? 'font-semibold' : 'text-muted-foreground'}
        >
          Рейтинг ↑
        </Link>
      </div>

      {/* ФИЛЬМЫ + СЕРИАЛЫ */}
      <MediaGrid items={items} />

      {/* ПАГИНАЦИЯ */}
      <Pagination page={page} totalPages={totalPages} limit={limit} />
    </div>
  )
}
