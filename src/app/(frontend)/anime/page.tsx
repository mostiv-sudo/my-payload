import { MediaPageLayout } from '@/components/layouts/MediaPageLayout'
import { getAnime } from '@/lib/getAnime'
import { toNumber, parseGenres } from '@/lib/query'
import type { SearchParams, MediaStatus, AnimeFilters, SortType } from '@/lib/types'

export const dynamic = 'force-dynamic' // полностью серверная страница

export interface AnimeSearchParams {
  sort: SortType
  page: number
  limit: number
  genreSlugs: string[]
  age?: number
  type?: 'movie' | 'series'
  status?: MediaStatus
}

function parseAnimeSearchParams(params: SearchParams): AnimeSearchParams {
  const type = params.type === 'movie' || params.type === 'series' ? params.type : undefined

  return {
    sort: (params.sort ?? 'rating_desc') as SortType,
    page: toNumber(params.page, 1),
    limit: toNumber(params.limit, 24),
    genreSlugs: parseGenres(params.genre).map(String), // строго string[]
    age: params.age !== undefined ? Number(params.age) : undefined,
    type,
    status: params.status as MediaStatus | undefined,
  }
}

interface AnimePageProps {
  searchParams: Promise<SearchParams>
}

export default async function AnimePage({ searchParams }: AnimePageProps) {
  const resolvedSearchParams = await searchParams
  const params = parseAnimeSearchParams(resolvedSearchParams)

  // Строго типизированные фильтры для getAnime
  const filters: AnimeFilters = {
    ...(params.genreSlugs.length > 0 && { genres: params.genreSlugs }),
    ...(params.age !== undefined && { age: params.age }),
    ...(params.type && { type: params.type }),
    ...(params.status && { status: params.status }),
  }

  // Получаем данные
  const { items, totalPages } = await getAnime({
    sort: params.sort,
    page: params.page,
    limit: params.limit,
    filters,
  })

  return (
    <MediaPageLayout
      title="Каталог аниме"
      basePath="/anime"
      items={items}
      page={params.page}
      totalPages={totalPages}
      limit={params.limit}
      sort={params.sort}
      type={params.type} // строго 'movie' | 'series' | undefined
    />
  )
}
