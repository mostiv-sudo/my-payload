import { MediaFilters, SortType } from './types'

type Params = {
  page: number
  limit: number
  sort: SortType
  filters?: MediaFilters
}

/**
 * Преобразует slug жанров в их числовые ID через Payload API
 */
async function resolveGenreIds(slugs: string[]): Promise<number[]> {
  if (!slugs.length) return []

  const url = new URL(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/genres`)
  url.searchParams.set('where[slug][in]', slugs.join(','))

  const res = await fetch(url.toString(), { cache: 'no-store' })
  if (!res.ok) {
    console.error('Ошибка при получении жанров:', await res.text())
    return []
  }

  const data = await res.json()
  return Array.isArray(data.docs) ? data.docs.map((d: any) => d.id) : []
}

export async function getMedia(
  endpoint: 'anime' | 'films' | 'tv',
  { page, limit, sort, filters }: Params,
) {
  const params = new URLSearchParams()

  const sortMap: Record<SortType, string> = {
    rating_desc: '-rating',
    rating_asc: 'rating',
    year_desc: '-year',
    year_asc: 'year',
  }
  params.set('sort', sortMap[sort] ?? '-rating')
  params.set('page', String(page))
  params.set('limit', String(limit))

  if (filters) {
    // Фильтруем жанры через их ID
    if (Array.isArray(filters.genres) && filters.genres.length) {
      params.set('where[genres][in]', filters.genres.join(','))
    }
    if (typeof filters.age === 'number') {
      params.set('where[minimal_age][less_than_equal]', String(filters.age))
    }
    if (filters.status) params.set('where[status][equals]', filters.status)
    if (filters.type) params.set('where[type][equals]', filters.type)
  }

  const url = `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/${endpoint}?${params.toString()}`

  try {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Ошибка загрузки данных: ${res.status} ${res.statusText}. Response: ${text}`)
    }
    const data = await res.json()
    return {
      items: Array.isArray(data.docs) ? data.docs : [],
      totalPages: typeof data.totalPages === 'number' ? data.totalPages : 1,
    }
  } catch (err) {
    console.error('getMedia error:', err)
    throw err
  }
}

export { resolveGenreIds }
