// src/hooks/episodesSyncKodik.ts
import type { PayloadRequest } from 'payload'

/* =======================
   Types
======================= */

interface EpisodeLike {
  id: number | string
  season: number
  episodeNumber: number
  videoLink?: string | null
  anime: number | string | { id: number | string }
}

interface KodikSeason {
  episodes?: Record<string, string>
}

interface KodikResult {
  seasons?: Record<string, KodikSeason>
  material_data?: {
    anime_title?: string
  }
}

/* =======================
   Type guards & helpers
======================= */

const isEpisodeLike = (ep: unknown): ep is EpisodeLike => {
  if (!ep || typeof ep !== 'object') return false
  const e = ep as EpisodeLike

  return (
    (typeof e.id === 'string' || typeof e.id === 'number') &&
    typeof e.season === 'number' &&
    typeof e.episodeNumber === 'number' &&
    !!e.anime
  )
}

const getAnimeId = (anime: number | string | { id: number | string }): number | string => {
  if (typeof anime === 'object' && anime !== null) {
    return anime.id
  }
  return anime
}

/* =======================
   Fuzzy utils
======================= */

const normalizeTitleFuzzy = (str = '') =>
  str
    .toLowerCase()
    .replace(/\[[^\]]*]/g, '')
    .replace(/\([^\)]*\)/g, '')
    .replace(/(?:сезон|season|тв|tv)\s*\d+/gi, '')
    .replace(/\d+/g, '')
    .replace(/[^a-z0-9а-яё ]/gi, '')
    .replace(/\s+/g, ' ')
    .trim()

const isTitleFuzzyMatch = (a: string, b: string) => {
  const A = normalizeTitleFuzzy(a)
  const B = normalizeTitleFuzzy(b)
  return A.includes(B) || B.includes(A)
}

/* =======================
   Kodik helpers
======================= */

const normalizeVideoLink = (link: string) => (link.startsWith('http') ? link : `https:${link}`)

const findEpisodeLink = (
  seasons: Record<string, KodikSeason>,
  season: number,
  episodeNumber: number,
): string | undefined => {
  const key = String(episodeNumber)

  const exact = seasons[String(season)]
  if (exact?.episodes?.[key]) return exact.episodes[key]

  for (const s of Object.values(seasons)) {
    if (s?.episodes?.[key]) return s.episodes[key]
  }

  return undefined
}

/* =======================
   Main handler
======================= */

export const episodesSyncKodik = async (req: PayloadRequest) => {
  const API_TOKEN = process.env.KODIK_API_TOKEN
  if (!API_TOKEN) {
    return new Response(JSON.stringify({ ok: false, message: 'API токен не задан' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { docs } = await req.payload.find({
    collection: 'episodes',
    pagination: false,
  })

  const episodesByAnime = new Map<number | string, EpisodeLike[]>()

  let skipped = 0
  let invalid = 0

  for (const raw of docs) {
    if (!isEpisodeLike(raw)) {
      invalid++
      continue
    }

    if (raw.videoLink) {
      skipped++
      continue
    }

    const animeId = getAnimeId(raw.anime)
    const list = episodesByAnime.get(animeId) ?? []
    list.push(raw)
    episodesByAnime.set(animeId, list)
  }

  let updated = 0
  let notFound = 0

  const updatedEpisodes: string[] = []
  const notFoundEpisodes: string[] = []

  const kodikCache = new Map<string, KodikResult | null>()
  const updates: Promise<unknown>[] = []

  for (const [animeId, episodes] of episodesByAnime.entries()) {
    const animeDoc = await req.payload.findByID({
      collection: 'anime',
      id: animeId,
    })

    const animeTitle: string | undefined = animeDoc?.title
    if (!animeTitle) {
      notFound += episodes.length
      continue
    }

    let matched: KodikResult | null

    if (kodikCache.has(animeTitle)) {
      matched = kodikCache.get(animeTitle)!
    } else {
      const res = await fetch(
        `https://kodikapi.com/search?token=${API_TOKEN}&with_episodes=true&with_material_data=true&types=anime-serial,anime&title=${encodeURIComponent(
          animeTitle,
        )}`,
      )

      if (!res.ok) {
        kodikCache.set(animeTitle, null)
        notFound += episodes.length
        continue
      }

      const data = await res.json()
      matched =
        (data?.results ?? []).find((item: KodikResult) => {
          const title = item?.material_data?.anime_title
          return title && isTitleFuzzyMatch(animeTitle, title)
        }) ?? null

      kodikCache.set(animeTitle, matched)
    }

    if (!matched?.seasons) {
      notFound += episodes.length
      continue
    }

    for (const ep of episodes) {
      const rawLink = findEpisodeLink(matched.seasons, ep.season, ep.episodeNumber)

      if (!rawLink) {
        notFound++
        notFoundEpisodes.push(`${animeTitle} — S${ep.season}E${ep.episodeNumber}`)
        continue
      }

      updates.push(
        req.payload.update({
          collection: 'episodes',
          id: ep.id,
          data: { videoLink: normalizeVideoLink(rawLink) },
        }),
      )

      updated++
      updatedEpisodes.push(`${animeTitle} — S${ep.season}E${ep.episodeNumber}`)
    }
  }

  await Promise.allSettled(updates)

  return new Response(
    JSON.stringify({
      ok: true,
      totalEpisodes: docs.length,
      skipped,
      invalid,
      updated,
      notFound,
      updatedEpisodes,
      notFoundEpisodes,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  )
}
