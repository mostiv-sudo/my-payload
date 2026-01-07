import { Payload } from 'payload'

export async function findByTitleEn(payload: Payload, title_en: string) {
  const res = await payload.find({
    collection: 'anime',
    where: { title_en: { equals: title_en } },
    limit: 1,
  })

  return res.docs[0] ?? null
}
type ExternalSource = 'shikimori' | 'kodik' | 'mal' | 'anidb'

/**
 * Поиск аниме по external_ids.<source>
 * Пример: external_ids.shikimori = "55830"
 */
export async function findByExternalId(
  payload: Payload,
  source: ExternalSource,
  value: string | number,
) {
  if (!source || value === undefined || value === null) {
    return null
  }

  const normalizedValue = String(value).trim()

  if (!normalizedValue) {
    return null
  }

  const res = await payload.find({
    collection: 'anime',
    where: {
      [`external_ids.${source}`]: {
        equals: normalizedValue,
      },
    },
    limit: 1,
    depth: 0,
  })

  return res.docs?.[0] ?? null
}

export async function createAnime(payload: Payload, data: any) {
  return payload.create({
    collection: 'anime',
    data,
  })
}

/**
 * Обновляет аниме по ID.
 * Если id — объект с полем id, извлекаем id.
 */
export async function updateAnime(
  payload: Payload,
  id: string | number | { id: string | number },
  data: Record<string, any>,
) {
  const animeId = typeof id === 'object' && id !== null ? id.id : id

  if (!animeId) {
    throw new Error('Anime ID is required for update')
  }

  return payload.update({
    collection: 'anime',
    id: animeId,
    data,
  })
}
