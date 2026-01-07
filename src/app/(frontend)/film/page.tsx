import { MediaPageLayout } from '@/components/layouts/MediaPageLayout'
import { parseMovieSearchParams } from '@/lib/parseMovieSearchParams'
import { getMovies } from '@/lib/getMovies'
import type { SearchParams } from '@/lib/types'

export const dynamic = 'force-dynamic' // Next.js будет полностью рендерить серверно

interface MoviesPageProps {
  searchParams: Promise<SearchParams>
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  // 1️⃣ Ждём searchParams
  const resolvedSearchParams = await searchParams

  // 2️⃣ Парсим и нормализуем параметры
  const params = parseMovieSearchParams(resolvedSearchParams)

  // 3️⃣ Получаем фильмы
  const { items, totalPages } = await getMovies(params)

  // 4️⃣ Рендер страницы
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
