// lib/types.ts

/**
 * Тип медиаконтента в системе
 * Используется для фильтрации и логики отображения
 */
export type MediaType = 'anime' | 'movie' | 'series'

/**
 * Endpoint API / источника данных
 * Можно расширить, если появятся отдельные сервисы
 */
export type MediaEndpoint = 'anime' | 'movie' | 'series'

/**
 * Статус выхода контента
 */
export type MediaStatus = 'announced' | 'airing' | 'completed'

/**
 * Фильтры для получения медиаконтента (API / getMedia)
 *
 * ⚠️ ВАЖНО:
 * - genres может быть string[] (slug) ИЛИ number[] (id)
 * - преобразование slug → id выполняется ДО запроса
 */
export type MediaFilters = {
  /** Жанры: slug'и или числовые ID */
  genres?: Array<string | number>

  /** Возрастной рейтинг */
  age?: number

  /** Статус выхода */
  status?: MediaStatus

  /**
   * Тип контента (актуально для anime endpoint)
   * Например: movie / series
   */
  type?: Exclude<MediaType, 'anime'>
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
  /** Пагинация */
  page?: string
  limit?: string

  /** Сортировка */
  sort?: SortType

  /** Фильтры */
  genre?: string // comma-separated: "action,drama"
  status?: MediaStatus
  age?: string

  /**
   * Тип контента (для /anime)
   * Например: movie / series
   */
  type?: Exclude<MediaType, 'anime'>
}

/**
 * Базовый тип элемента медиаконтента
 * (можно расширять под конкретные use-case)
 */
export type MediaItem = {
  id: number
  title: string
  poster?: string
  poster_url?: string
  slug: string
  description: string

  year?: number
  rating?: number
  type?: MediaType
}

/**
 * Тип аниме (расширяет MediaItem)
 * Можно добавить поля из payload / API
 */
export type Anime = MediaItem & {
  episodes?: Array<{
    id: string
    title: string
    episodeNumber: number
    season: number
    videoLink?: string
  }>
  genres?: { id: number; title: string; slug: string }[]
  status?: MediaStatus
  minimal_age?: number
  type?: 'movie' | 'series' | 'anime'
}
