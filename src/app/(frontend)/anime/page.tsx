import { MediaPageLayout } from '@/components/layouts/MediaPageLayout'
import { getAnime } from '@/lib/getAnime'
import { parseBaseMediaParams } from '@/lib/mediaPage'
import type { SearchParams, AnimeFilters } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function AnimePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = parseBaseMediaParams(await searchParams)

  const filters: AnimeFilters = {
    ...(params.genreSlugs.length && { genres: params.genreSlugs }),
    ...(params.age !== undefined && { age: params.age }),
    ...(params.status && { status: params.status }),
  }
  // TODO: обновить запрос
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
    />
  )
}
