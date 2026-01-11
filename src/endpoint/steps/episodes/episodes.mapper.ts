import { makeSlug } from '../utils/slug'

type KodikAnime = {
  id: string
  title?: string
  slug?: string
  duration?: number
  seasons?: Record<
    string,
    {
      episodes?: Record<string, string | null | undefined>
    }
  >
}

type EpisodeSeed = {
  animeKodikId: string
  season: number
  episodeNumber: number
  title: string
  description: string
  duration: number
  released: null
  slug: string
  videoLink: string
}

export function mapEpisodesFromJson(anime: KodikAnime): EpisodeSeed[] {
  if (!anime?.seasons) return []

  const episodes: EpisodeSeed[] = []

  const animeTitle = anime.title?.trim() || 'Без названия'
  const baseSlug = anime.slug?.trim() || anime.id

  for (const [seasonKey, season] of Object.entries(anime.seasons)) {
    if (!season?.episodes) continue

    const seasonNumber = Number(seasonKey)
    if (Number.isNaN(seasonNumber)) continue

    for (const [episodeKey, rawLink] of Object.entries(season.episodes)) {
      if (!rawLink) continue

      const episodeNumber = Number(episodeKey)
      if (Number.isNaN(episodeNumber)) continue

      const videoLink = rawLink.startsWith('//') ? `https:${rawLink}` : rawLink

      episodes.push({
        animeKodikId: anime.id,
        season: seasonNumber,
        episodeNumber,
        title: `${animeTitle} — Серия ${episodeNumber}`,
        description: '',
        duration: anime.duration ?? 0,
        released: null,
        slug: makeSlug(`${baseSlug}-s${seasonNumber}-e${episodeNumber}`),
        videoLink,
      })
    }
  }

  return episodes
}
