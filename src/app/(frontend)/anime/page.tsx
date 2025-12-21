// app/anime/page.tsx

import { getAnime } from '@/lib/getAnime'
import { MediaPageLayout } from '@/components/layouts/MediaPageLayout'
import { toNumber, parseGenres } from '@/lib/query'
import type { SearchParams } from '@/lib/types'

/**
 * Нормализует searchParams из URL в удобную и типобезопасную форму.
 * Позволяет держать page-компонент максимально простым и читаемым.
 */
function parseAnimeSearchParams(params: SearchParams) {
  return {
    // Сортировка по умолчанию
    sort: params.sort ?? 'rating_desc',

    // Пагинация с безопасным приведением типов
    page: toNumber(params.page, 1),
    limit: toNumber(params.limit, 24),

    // Фильтры
    genreSlugs: parseGenres(params.genre),
    age: params.age ? Number(params.age) : undefined,
    type: params.type,
    status: params.status,
  }
}

export default async function AnimePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  /**
   * Получаем и нормализуем параметры из URL
   */
  const params = parseAnimeSearchParams(await searchParams)

  /**
   * Формируем объект фильтров.
   * Поля добавляются условно, чтобы в getAnime
   * не попадали undefined-значения.
   */
  const filters = {
    ...(params.genreSlugs.length > 0 && { genres: params.genreSlugs }),
    ...(params.age !== undefined && { age: params.age }),
    ...(params.type && { type: params.type }),
    ...(params.status && { status: params.status }),
  }

  /**
   * Загружаем список аниме с учётом фильтров, сортировки и пагинации
   */
  const { items, totalPages } = await getAnime({
    sort: params.sort,
    page: params.page,
    limit: params.limit,
    filters,
  })

  /**
   * Рендерим универсальный layout для медиа-каталогов
   */
  return (
    <MediaPageLayout
      title="Каталог аниме"
      basePath="/anime"
      items={items}
      page={params.page}
      totalPages={totalPages}
      limit={params.limit}
      sort={params.sort}
    />
  )
}
