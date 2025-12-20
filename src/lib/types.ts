// lib/types.ts

/** Тип медиаконтента */
export type MediaType = 'anime' | 'movie' | 'series'

/** Фильтры для медиа */
export type MediaFilters = {
  genres?: string[] // список slug жанров
  age?: number // возрастной рейтинг
  status?: 'announced' | 'airing' | 'completed'
  type?: 'movie' | 'series' // только для фильмов/сериалов
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
