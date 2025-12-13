import { getAnimeByType } from '@/lib/getAnimeByType'
import { MediaGrid } from '@/components/MediaGrid'
import { Pagination } from '@/components/Pagination'

type SearchParams = {
  page?: string
  limit?: string
}

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  const page = Math.max(1, Number(params.page) || 1)
  const limit = Math.max(1, Number(params.limit) || 24)

  const { items, totalPages } = await getAnimeByType({
    type: 'movie',
    page,
    limit,
  })

  return (
    <div className="container mx-auto py-10 min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-6">Фильмы</h1>

      {/* ⭐ рейтинг включён */}
      <MediaGrid items={items} showRating />

      <Pagination page={page} totalPages={totalPages} limit={limit} />
    </div>
  )
}
