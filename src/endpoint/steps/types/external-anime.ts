export interface ExternalAnime {
  id: string
  title: string
  title_orig?: string
  link?: string
  type?: string
  year?: number
  description?: string
  duration?: number
  last_season?: number
  last_episode?: number
  minimal_age?: number
  rating_mpaa?: string
  anime_status?: string
  released_at?: string

  shikimori_rating?: number
  kinopoisk_id?: string
  imdb_id?: string
  shikimori_id?: string
}
