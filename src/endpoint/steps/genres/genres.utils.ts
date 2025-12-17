export type GenreJsonItem = {
  genre: string
  english_name: string
  description?: string
}

export function normalizeGenreKey(value: string): string {
  return value.trim().toLowerCase()
}
