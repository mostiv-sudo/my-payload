import { MediaItem } from '@/lib/types'

export type SearchDoc = {
  id: string
  slug: string
  searchTitle: string
  poster?: string
  poster_url?: string
  type: 'movie' | 'series'
  year?: number
}

export function mapSearchDocs(docs: SearchDoc[]): MediaItem[] {
  return docs.map((item) => ({
    id: Number(item.id), // преобразуем в number
    slug: item.slug,
    title: item.searchTitle,
    poster: item.poster,
    poster_url: item.poster_url,
    type: item.type,
    year: item.year,
    description: '', // добавляем обязательное поле
  }))
}
