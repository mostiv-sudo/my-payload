import { mapStatus, mapType } from './utils/enums'
import { ExternalAnime } from './types/external-anime'

export function mapAnime(item: ExternalAnime) {
  const type = mapType(item.type)

  // Сериал: сезоны и эпизоды
  const seasonsCount = type === 'series' ? Number(item.last_season ?? null) : null
  const episodesCount = type === 'series' ? Number(item.last_episode ?? null) : null

  // Дата выхода
  const released = item.released_at ? new Date(item.released_at).toISOString() : null

  // Год как число
  const year = item.year ? Number(item.year) : null

  // Рейтинг как число
  const rating = typeof item.shikimori_rating === 'number' ? item.shikimori_rating : 0

  return {
    title: item.title ?? '',
    title_en: item.title_orig ?? item.title ?? '',
    play_link: item.link ?? null,

    year,
    description: item.description ?? '',
    poster_url: item.anime_poster_url ?? '/placeholder.jpg',
    rating,

    type,
    duration: type === 'movie' ? Number(item.duration ?? null) : null,
    seasonsCount,
    episodesCount,

    minimal_age: item.minimal_age ?? null,
    rating_mpaa: item.rating_mpaa ?? null,

    status: mapStatus(item.anime_status),
    released,

    external_ids: {
      kinopoisk: item.kinopoisk_id ? String(item.kinopoisk_id) : null,
      imdb: item.imdb_id ? String(item.imdb_id) : null,
      shikimori: item.shikimori_id ? String(item.shikimori_id) : null,
      kodik: item.id,
      external_export_id: item.id ?? null,
    },
  }
}
