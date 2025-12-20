// app/film/page.tsx
import { getMedia, resolveGenreIds } from '@/lib/getMedia'
import { MediaPageLayout } from '@/components/layouts/MediaPageLayout'
import { toNumber, parseGenres } from '@/lib/query'
import type { SearchParams } from '@/lib/types'

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  const sort = params.sort ?? 'rating_desc'
  const page = toNumber(params.page, 1)
  const limit = toNumber(params.limit, 24)

  const genreSlugs = parseGenres(params.genre)
  const genreIds = await resolveGenreIds(genreSlugs)

  const filters = {
    type: 'movie' as const,
    genres: genreIds.map(String),
    age: params.age ? Number(params.age) : undefined,
    status: params.status,
  }

  const { items, totalPages } = await getMedia('anime', { page, limit, sort, filters })

  return (
    <MediaPageLayout
      title="Фильмы"
      basePath="/film"
      items={items}
      page={page}
      totalPages={totalPages}
      limit={limit}
      sort={sort}
      showRating
      type="movie"
    />
  )
}
