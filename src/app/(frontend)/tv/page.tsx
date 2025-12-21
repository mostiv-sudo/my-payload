// app/tv/page.tsx

import { getMedia, resolveGenreIds } from '@/lib/getMedia'
import { MediaPageLayout } from '@/components/layouts/MediaPageLayout'
import { toNumber, parseGenres } from '@/lib/query'
import type { SearchParams } from '@/lib/types'

/**
 * Нормализует searchParams для страницы сериалов
 */
function parseSeriesSearchParams(params: SearchParams) {
  return {
    sort: params.sort ?? 'rating_desc',
    page: toNumber(params.page, 1),
    limit: toNumber(params.limit, 24),
    age: params.age ? Number(params.age) : undefined,
    status: params.status,
    genreSlugs: parseGenres(params.genre),
  }
}

export default async function SeriesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = parseSeriesSearchParams(await searchParams)

  /**
   * slug → genreId
   */
  const genreIds = await resolveGenreIds(params.genreSlugs)

  /**
   * Фильтры для сериалов (anime + type=series)
   */
  const filters = {
    type: 'series' as const,
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
      title="Сериалы"
      basePath="/tv"
      items={items}
      page={params.page}
      totalPages={totalPages}
      limit={params.limit}
      sort={params.sort}
      showRating
      type="series"
    />
  )
}
