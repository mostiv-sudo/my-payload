import { MediaPageLayout } from '@/components/layouts/MediaPageLayout'
import { getMedia, resolveGenreIds } from '@/lib/getMedia'
import { parseBaseMediaParams } from '@/lib/mediaPage'
import type { SearchParams } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function SeriesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = parseBaseMediaParams(await searchParams)

  const genreIds = await resolveGenreIds(params.genreSlugs)

  const { items, totalPages } = await getMedia({
    sort: params.sort,
    page: params.page,
    limit: params.limit,
    filters: {
      type: 'series',
      ...(genreIds.length && { genres: genreIds }),
      ...(params.age !== undefined && { age: params.age }),
      ...(params.status && { status: params.status }),
    },
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
      type="series"
      showRating
    />
  )
}
