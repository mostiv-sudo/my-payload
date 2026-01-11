import { Payload } from 'payload'

export async function findAnimeByKodikId(payload: Payload, kodikId: string) {
  const res = await payload.find({
    collection: 'anime',
    limit: 1,
    depth: 0, // 🔥 убирает lateral + json_agg
    pagination: false,
    where: {
      'external_ids.kodik': { equals: kodikId },
    },
  })

  return res.docs[0] ?? null
}

export async function episodeExists(
  payload: Payload,
  animeId: string,
  season: number,
  episodeNumber: number,
) {
  const res = await payload.find({
    collection: 'episodes',
    where: {
      anime: { equals: animeId },
      season: { equals: season },
      episodeNumber: { equals: episodeNumber },
    },
    limit: 1,
  })

  return res.totalDocs > 0
}

export async function createEpisode(payload: Payload, data: any) {
  return payload.create({
    collection: 'episodes',
    data,
    draft: false,
  })
}

export async function findEpisodesByAnime(payload: Payload, animeId: string) {
  const res = await payload.find({
    collection: 'episodes',
    depth: 0,
    pagination: false,
    where: {
      anime: { equals: animeId },
    },
    select: {
      season: true,
      episodeNumber: true,
    },
  })

  return res.docs
}
