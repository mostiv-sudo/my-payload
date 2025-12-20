export type AnimeFilters = {
  genres?: string[] // slug жанров
  age?: number // возраст пользователя
  type?: 'movie' | 'series' // тип аниме
  status?: 'announced' | 'airing' | 'completed' // статус
}

type Params = {
  sort?: 'rating_desc' | 'rating_asc' | 'year_desc' | 'year_asc'
  page?: number
  limit?: number
  filters?: AnimeFilters
}

// Функция для получения id жанров по slug
async function getGenreIdsBySlug(slugs: string[]): Promise<string[]> {
  if (!slugs.length) return []

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/genres?where[slug][in]=${slugs.join(',')}`,
    { cache: 'no-store' },
  )
  if (!res.ok) return []

  const data = await res.json()
  return data.docs.map((g: any) => g.id)
}

export async function getAnime({ sort = 'rating_desc', page = 1, limit = 24, filters }: Params) {
  const params = new URLSearchParams()

  // --- Сортировка ---
  let order: string
  switch (sort) {
    case 'rating_asc':
      order = 'rating'
      break
    case 'year_desc':
      order = '-year'
      break
    case 'year_asc':
      order = 'year'
      break
    default:
      order = '-rating'
  }

  params.set('sort', order)
  params.set('page', String(page))
  params.set('limit', String(limit))

  // --- Фильтры ---
  if (filters?.genres?.length) {
    // Конвертируем slug жанров в id перед отправкой запроса
    const genreIds = await getGenreIdsBySlug(filters.genres)
    if (genreIds.length) {
      params.set('where[genres][in]', genreIds.join(','))
    }
  }

  if (filters?.age !== undefined) {
    params.set('where[minimal_age][less_than_equal]', String(filters.age))
  }
  if (filters?.type) {
    params.set('where[type][equals]', filters.type)
  }
  if (filters?.status) {
    params.set('where[status][equals]', filters.status)
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/anime?${params.toString()}`, {
    cache: 'no-store',
  })

  if (!res.ok) throw new Error('Ошибка загрузки аниме')

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
