import { getMedia, resolveGenreIds } from './getMedia'
import type { MovieSearchParams } from './parseMovieSearchParams'
import { buildMovieFilters } from './filters'
import type { MediaFilters, SortType } from './types'

export interface MovieData {
  items: any[]
  totalPages: number
}

/**
 * Получает фильмы с учётом searchParams
 * @param params - Нормализованные параметры поиска фильмов
 * @returns Объект с массивом фильмов и количеством страниц
 */
export async function getMovies(params: MovieSearchParams): Promise<MovieData> {
  // 1️⃣ Преобразуем slug жанров в id
  const genreIds = await resolveGenreIds(params.genreSlugs)

  // 2️⃣ Создаём фильтры строго типизированные
  const filters: MediaFilters = buildMovieFilters(params, genreIds)

  // 3️⃣ Запрашиваем данные через getMedia
  return getMedia({
    page: params.page,
    limit: params.limit,
    sort: params.sort as SortType, // безопасное приведение к SortType
    filters,
  })
}
