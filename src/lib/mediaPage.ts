import { toNumber, parseGenres } from '@/lib/query'
import type { SearchParams, SortType, MediaStatus } from '@/lib/types'

export interface BaseMediaParams {
  sort: SortType
  page: number
  limit: number
  age?: number
  status?: MediaStatus
  genreSlugs: string[]
}

export function parseBaseMediaParams(
  params: SearchParams,
  defaults: { limit?: number } = {},
): BaseMediaParams {
  return {
    sort: (params.sort ?? 'rating_desc') as SortType,
    page: toNumber(params.page, 1),
    limit: toNumber(params.limit, defaults.limit ?? 24),
    age: params.age ? Number(params.age) : undefined,
    status: params.status as MediaStatus | undefined,
    genreSlugs: parseGenres(params.genre).map(String),
  }
}
