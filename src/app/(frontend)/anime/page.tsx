// app/anime/page.tsx
import { getAnime } from '@/lib/getAnime'
import { MediaPageLayout } from '@/components/layouts/MediaPageLayout'
import { toNumber, parseGenres } from '@/lib/query'

import type { SearchParams } from '@/lib/types'

export default async function AnimePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams

  const sort = params.sort ?? 'rating_desc'
  const page = toNumber(params.page, 1)
  const limit = toNumber(params.limit, 24)

  const filters = {
    genres: parseGenres(params.genre),
    age: params.age ? Number(params.age) : undefined,
    type: params.type,
    status: params.status,
  }

  const { items, totalPages } = await getAnime({ sort, page, limit, filters })

  return (
    <MediaPageLayout
      title="Каталог аниме"
      basePath="/anime"
      items={items}
      page={page}
      totalPages={totalPages}
      limit={limit}
      sort={sort}
    />
  )
}
