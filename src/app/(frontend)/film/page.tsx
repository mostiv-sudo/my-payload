// app/film/page.tsx

import { getMedia, resolveGenreIds } from '@/lib/getMedia'
import { MediaPageLayout } from '@/components/layouts/MediaPageLayout'
import { toNumber, parseGenres } from '@/lib/query'
import type { SearchParams } from '@/lib/types'

/**
 * Нормализует searchParams для страницы фильмов
 */
function parseMovieSearchParams(params: SearchParams) {
  return {
    sort: params.sort ?? 'rating_desc',
    page: toNumber(params.page, 1),
    limit: toNumber(params.limit, 24),
    age: params.age ? Number(params.age) : undefined,
    status: params.status,
    genreSlugs: parseGenres(params.genre),
  }
}

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = parseMovieSearchParams(await searchParams)

  /**
   * slug → genreId
   */
  const genreIds = await resolveGenreIds(params.genreSlugs)

  /**
   * Фильтры для фильмов (anime + type=movie)
   */
  const filters = {
    type: 'movie' as const,
    ...(genreIds.length > 0 && { genres: genreIds }),
    ...(params.age !== undefined && { age: params.age }),
    ...(params.status && { status: params.status }),
  }

  /**
   * Получаем данные из коллекции anime
   */
  const { items, totalPages } = await getMedia({
    page: params.page,
    limit: params.limit,
    sort: params.sort,
    filters,
  })

  return (
    <MediaPageLayout
      title="Фильмы"
      basePath="/film"
      items={items}
      page={params.page}
      totalPages={totalPages}
      limit={params.limit}
      sort={params.sort}
      showRating
      type="movie"
    />
  )
}
