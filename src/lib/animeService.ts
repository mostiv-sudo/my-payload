import { Anime as AnimeType, Genre } from './types'

const BASE_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL

export const statusMap: Record<string, string> = {
  announced: 'Анонс',
  airing: 'Выходит',
  completed: 'Завершено',
}

/**
 * Fetch anime by slug or id
 */
export async function getAnime(params: {
  slug?: string
  id?: string | number
}): Promise<AnimeType | null> {
  try {
    let query = ''
    if (params.slug) query = `where[slug][equals]=${params.slug}`
    else if (params.id !== undefined) query = `where[id][equals]=${params.id}`
    else return null

    const res = await fetch(`${BASE_URL}/api/anime?${query}&depth=1`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    return data?.docs?.[0] || null
  } catch (err) {
    console.error('Failed to fetch anime:', err)
    return null
  }
}

/**
 * Extract genre IDs from numbers or objects
 */
export function extractGenreIds(genres: (number | Genre)[]): number[] {
  return genres.map((g) => (typeof g === 'number' ? g : g.id)).filter(Boolean)
}

/**
 * Fetch genres by array of IDs
 */
export async function getGenresByIds(ids: number[]): Promise<Genre[]> {
  if (!ids.length) return []
  try {
    const res = await fetch(`${BASE_URL}/api/genres?where[id][in]=${ids.join(',')}`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.docs || []
  } catch {
    return []
  }
}
