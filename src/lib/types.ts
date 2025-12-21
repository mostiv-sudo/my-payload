// lib/types.ts

/** Тип медиаконтента */
export type MediaType = 'anime' | 'movie' | 'series'

export type MediaEndpoint = 'anime'

export type MediaFilters = {
  genres?: (string | number)[]
  age?: number
  status?: 'announced' | 'airing' | 'completed'
  type?: 'movie' | 'series'
}

/** Сортировка */
export type SortType = 'rating_desc' | 'rating_asc' | 'year_desc' | 'year_asc'

/** Query-параметры страницы (из URL) */
export type SearchParams = {
  page?: string
  limit?: string

  /** сортировка */
  sort?: SortType

  /** фильтры */
  genre?: string // теперь всегда строка (comma-separated), чтобы избежать string[]
  status?: 'announced' | 'airing' | 'completed'
  age?: string
  type?: 'movie' | 'series' // добавляем, если нужно фильтровать по типу
}
