// lib/getAnimeByType.ts

export type AnimeSort = 'rating_desc' | 'rating_asc' | 'year_desc' | 'year_asc'

export type AnimeFilters = {
  genres?: string[] // slug жанров
  age?: number // минимальный возраст
  status?: 'announced' | 'airing' | 'completed'
}

type Params = {
  type: 'movie' | 'series'
  page?: number
  limit?: number
  sort?: AnimeSort
  filters?: AnimeFilters
}

export async function getAnimeByType({
  type,
  page = 1,
  limit = 25,
  sort = 'rating_desc',
  filters,
}: Params) {
  const params = new URLSearchParams()

  // --- тип ---
  params.set('where[type][equals]', type)

  // --- сортировка ---
  switch (sort) {
    case 'rating_asc':
      params.set('sort', 'rating')
      break
    case 'year_desc':
      params.set('sort', '-year')
      break
    case 'year_asc':
      params.set('sort', 'year')
      break
    default:
      params.set('sort', '-rating')
  }

  params.set('page', String(page))
  params.set('limit', String(limit))

  // --- фильтры ---
  if (filters?.genres?.length) {
    params.set('where[genres][in]', filters.genres.join(','))
  }

  if (filters?.status) {
    params.set('where[status][equals]', filters.status)
  }

  if (filters?.age !== undefined) {
    params.set('where[minimal_age][less_than_equal]', String(filters.age))
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/anime?${params.toString()}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Ошибка загрузки аниме')
  }

  const data = await res.json()

  return {
    items: data.docs.map((item: any) => ({
      id: String(item.id),
      slug: item.slug,
      title: item.title,
      poster: item.poster?.url ?? item.poster ?? null,
      type: item.type,
      year: item.year,
      rating: item.rating,
    })),
    totalPages: data.totalPages,
    page: data.page,
  }
}
