import { parseGenres, toNumber } from './query'
import type { MediaStatus, SearchParams, SortType } from './types'

export interface MovieSearchParams {
  sort: SortType
  page: number
  limit: number
  age?: number
  status?: MediaStatus
  genreSlugs: string[]
}

/**
 * Нормализует searchParams для страницы фильмов
 */
export function parseMovieSearchParams(params: SearchParams): MovieSearchParams {
  const status = params.status as MediaStatus | undefined

  return {
    sort: (params.sort ?? 'rating_desc') as SortType,
    page: toNumber(params.page, 1),
    limit: toNumber(params.limit, 24),
    age: params.age !== undefined ? Number(params.age) : undefined,
    status,
    genreSlugs: parseGenres(params.genre),
  }
}
