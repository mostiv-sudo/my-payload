import { makeSlug } from '../utils/slug'

type KodikAnime = {
  id: string
  slug?: string
  duration?: number
  seasons?: Record<
    string,
    {
      episodes?: Record<string, string>
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

  for (const [seasonNum, season] of Object.entries(anime.seasons)) {
    if (!season?.episodes) continue

    for (const [epNum, link] of Object.entries(season.episodes)) {
      if (!link) continue

      const seasonNumber = Number(seasonNum)
      const episodeNumber = Number(epNum)

      if (Number.isNaN(seasonNumber) || Number.isNaN(episodeNumber)) {
        continue
      }

      const baseSlug = anime.slug ?? anime.id

      episodes.push({
        animeKodikId: anime.id,
        season: seasonNumber,
        episodeNumber,
        title: `Episode ${episodeNumber}`,
        description: '',
        duration: anime.duration ?? 0,
        released: null,
        slug: makeSlug(`${baseSlug}-s${seasonNumber}-e${episodeNumber}`),
        videoLink: link.startsWith('//') ? `https:${link}` : link,
      })
    }
  }

  return episodes
}
