import { Payload } from 'payload'

export async function findByTitleEn(payload: Payload, title_en: string) {
  const res = await payload.find({
    collection: 'anime',
    where: { title_en: { equals: title_en } },
    limit: 1,
  })

  return res.docs[0] ?? null
}

export async function createAnime(payload: Payload, data: any) {
  return payload.create({
    collection: 'anime',
    data,
  })
}

export async function updateAnime(payload: Payload, id: string, data: any) {
  return payload.update({
    collection: 'anime',
    id,
    data,
  })
}
