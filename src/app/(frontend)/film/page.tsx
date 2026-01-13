import { MediaPageLayout } from '@/components/layouts/MediaPageLayout'
import { getMovies } from '@/lib/getMovies'
import { parseMovieSearchParams } from '@/lib/parseMovieSearchParams'
import type { SearchParams } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  // 1️⃣ Нормализуем searchParams строго под фильмы
  const params = parseMovieSearchParams(await searchParams)

  // 2️⃣ Передаём ОДИН объект — без ручной сборки
  const { items, totalPages } = await getMovies(params)

  // 3️⃣ Рендер
  return (
    <MediaPageLayout
      title="Фильмы"
      basePath="/film"
      items={items}
      page={params.page}
      totalPages={totalPages}
      limit={params.limit}
      sort={params.sort}
      type="movie"
      showRating
    />
  )
}
