/**
 * Тип медиаконтента в системе
 * Используется для фильтрации и логики отображения
 */
export type MediaType = 'anime' | 'movie' | 'series'

/**
 * Endpoint API / источника данных
 */
export type MediaEndpoint = 'anime' | 'movie' | 'series'

/**
 * Статус выхода контента
 */
export type MediaStatus = 'announced' | 'airing' | 'completed'

/**
 * Фильтры для получения медиаконтента (API / getMedia)
 *
 * ⚠️ genres может быть string[] (slug) ИЛИ number[] (id)
 * Преобразование slug → id выполняется ДО запроса
 */
export type MediaFilters = {
  /** Жанры: slug'и или числовые ID */
  genres?: Array<string | number>

  /** Возрастной рейтинг */
  age?: number

  /** Статус выхода */
  status?: MediaStatus

  /** Тип контента (movie | series) */
  type?: Exclude<MediaType, 'anime'>
}

/**
 * Фильтры для аниме (точно string[] для жанров)
 */
export type AnimeFilters = {
  genres?: string[]
  age?: number
  status?: MediaStatus
  type?: 'movie' | 'series'
}

/**
 * Тип сортировки
 */
export type SortType = 'rating_desc' | 'rating_asc' | 'year_desc' | 'year_asc'

/**
 * Query-параметры страницы (из URL)
 *
 * ⚠️ ВСЕ значения — строки,
 * т.к. приходят напрямую из searchParams
 */
export type SearchParams = {
  page?: string
  limit?: string
  sort?: SortType
  genre?: string // comma-separated: "action,drama"
  status?: MediaStatus
  age?: string
  type?: Exclude<MediaType, 'anime'> | 'movie' | 'series'
}

/**
 * Базовый тип элемента медиаконтента
 */
export type MediaItem = {
  id: number
  slug: string
  title: string
  description: string
  poster?: string
  poster_url?: string
  year?: number
  rating?: number
  type?: Exclude<MediaType, 'anime'> // movie | series
}

/**
 * Тип жанра
 */
export type Genre = {
  id: number
  title: string
  slug: string
}

/**
 * Тип аниме (расширяет MediaItem)
 */
export type Anime = MediaItem & {
  episodes?: Array<{
    id: string
    title: string
    episodeNumber: number
    season: number
    videoLink?: string
  }>
  genres?: Genre[]
  status?: MediaStatus
  minimal_age?: number
  type?: 'movie' | 'series' | 'anime'
  play_link?: string
  duration?: number
  episodesCount?: number
  seasonsCount?: number
  title_en?: string
}
