// lib/query.ts
export function toNumber(value: string | undefined, fallback: number) {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

export function parseGenres(value?: string | string[]): string[] {
  if (!value) return []
  const str = Array.isArray(value) ? value.join(',') : value
  return Array.from(new Set(str.split(',').filter(Boolean)))
}
