import type { MovieSearchParams } from './parseMovieSearchParams'
import { MediaFilters } from './types'

/**
 * Создаёт фильтры для запроса фильмов
 */
export function buildMovieFilters(params: MovieSearchParams, genreIds: number[]): MediaFilters {
  const filters: MediaFilters = { type: 'movie' }

  if (genreIds.length > 0) filters.genres = genreIds
  if (params.age !== undefined) filters.age = params.age
  if (params.status) filters.status = params.status

  return filters
}
