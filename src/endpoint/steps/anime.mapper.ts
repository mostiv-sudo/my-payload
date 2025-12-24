import { mapStatus, mapType } from './utils/enums'
import { ExternalAnime } from './types/external-anime'

export function mapAnime(item: ExternalAnime) {
  const type = mapType(item.type)

  return {
    title: item.title,
    title_en: item.title_orig || item.title,
    play_link: item.link ?? null,

    year: item.year ?? null,
    description: item.description ?? '',
    poster_url: item.anime_poster_url ?? '/placeholder.jpg',
    rating: item.shikimori_rating ?? 0,

    type,
    duration: type === 'movie' ? (item.duration ?? null) : null,
    seasonsCount: type === 'series' ? (item.last_season ?? null) : null,
    episodesCount: type === 'series' ? (item.last_episode ?? null) : null,

    minimal_age: item.minimal_age ?? null,
    rating_mpaa: item.rating_mpaa ?? null,

    status: mapStatus(item.anime_status),
    released: item.released_at ?? null,

    external_ids: {
      kinopoisk: item.kinopoisk_id ?? '',
      imdb: item.imdb_id ?? '',
      shikimori: item.shikimori_id ?? '',
      kodik: item.id,
    },
  }
}
