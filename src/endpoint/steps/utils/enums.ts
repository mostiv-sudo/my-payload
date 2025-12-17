export type AnimeType = 'movie' | 'series'
export type AnimeStatus = 'announced' | 'airing' | 'completed'

export function mapType(type?: string): AnimeType {
  if (!type) return 'movie'
  const t = type.toLowerCase()
  return t.includes('serial') || t.includes('series') || t.includes('tv') ? 'series' : 'movie'
}

export function mapStatus(status?: string): AnimeStatus {
  if (!status) return 'announced'
  const s = status.toLowerCase()
  if (s === 'ongoing') return 'airing'
  if (s === 'released') return 'completed'
  return 'announced'
}
