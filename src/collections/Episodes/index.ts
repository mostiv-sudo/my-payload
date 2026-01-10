import type { CollectionConfig, PayloadRequest } from 'payload'
import { slugField } from 'payload'

// Функция для "приблизительного" сравнения названий
const normalizeTitleFuzzy = (str = '') =>
  str
    .toLowerCase()
    .replace(/\[[^\]]*\]/g, '') // убрать [ТВ-3]
    .replace(/\([^\)]*\)/g, '') // убрать (2026)
    .replace(/(?:сезон|season|тв|tv)\s*\d+/gi, '') // убрать слова с номером сезона
    .replace(/\d+/g, '') // убрать цифры
    .replace(/[^a-z0-9а-яё ]/gi, '') // оставить только буквы и цифры
    .replace(/\s+/g, ' ')
    .trim()

const isTitleFuzzyMatch = (a: string, b: string) => {
  const A = normalizeTitleFuzzy(a)
  const B = normalizeTitleFuzzy(b)
  return A.includes(B) || B.includes(A)
}

// ===================

export const Episodes: CollectionConfig = {
  slug: 'episodes',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'anime', 'season', 'episodeNumber', 'released'],
  },

  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },

  fields: [
    { name: 'anime', type: 'relationship', relationTo: 'anime', required: true },
    { name: 'season', type: 'number', required: true, defaultValue: 1 },
    { name: 'episodeNumber', type: 'number', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'released', type: 'date' },
    { name: 'duration', type: 'number' },
    { name: 'videoLink', type: 'text' },
    slugField({ fieldToUse: 'title' }),
  ],

  endpoints: [
    {
      path: '/episodes-sync-kodik',
      method: 'get',
      handler: async (req: PayloadRequest) => {
        const API_TOKEN = process.env.KODIK_API_TOKEN
        if (!API_TOKEN) {
          return new Response(JSON.stringify({ ok: false, message: 'API токен не задан' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        const { docs } = await req.payload.find({ collection: 'episodes', pagination: false })

        const episodesByAnime = new Map<string, any[]>()
        let skipped = 0,
          invalid = 0

        // Группируем эпизоды без videoLink
        for (const ep of docs as any[]) {
          if (!ep?.id || ep.videoLink) {
            skipped++
            continue
          }
          if (typeof ep.season !== 'number' || typeof ep.episodeNumber !== 'number' || !ep.anime) {
            invalid++
            continue
          }

          const animeId = typeof ep.anime === 'string' ? ep.anime : ep.anime.id
          if (!episodesByAnime.has(animeId)) episodesByAnime.set(animeId, [])
          episodesByAnime.get(animeId)!.push(ep)
        }

        let updated = 0,
          notFound = 0
        const updatedEpisodes: string[] = [],
          notFoundEpisodes: string[] = [],
          skippedEpisodes: string[] = []
        const updates: Promise<any>[] = []

        for (const [animeId, episodes] of episodesByAnime.entries()) {
          const animeDoc = await req.payload.findByID({ collection: 'anime', id: animeId })
          const animeTitle = animeDoc?.title

          if (!animeTitle) {
            notFound += episodes.length
            episodes.forEach((ep) =>
              notFoundEpisodes.push(`Нет anime — S${ep.season}E${ep.episodeNumber}`),
            )
            continue
          }

          // Запрос к Kodik
          const kodikRes = await fetch(
            `https://kodikapi.com/search?token=${API_TOKEN}&with_episodes=true&with_material_data=true&types=anime-serial,anime&title=${encodeURIComponent(
              animeTitle,
            )}`,
          )

          if (!kodikRes.ok) {
            notFound += episodes.length
            episodes.forEach((ep) =>
              notFoundEpisodes.push(`Ошибка Kodik — S${ep.season}E${ep.episodeNumber}`),
            )
            continue
          }

          const data = await kodikRes.json()
          const results: any[] = data?.results ?? []

          // Находим первый результат с похожим anime_title
          const matched = results.find((item) => {
            const md = item?.material_data
            if (!md?.anime_title) return false
            return isTitleFuzzyMatch(animeTitle, md.anime_title)
          })

          if (!matched) {
            notFound += episodes.length
            episodes.forEach((ep) =>
              notFoundEpisodes.push(`Не найден anime_title — S${ep.season}E${ep.episodeNumber}`),
            )
            continue
          }

          const seasons: Record<string, any> = matched.seasons ?? {}

          for (const ep of episodes) {
            const episodeKey = String(ep.episodeNumber)
            let rawLink: string | undefined

            // точный сезон
            const exactSeason = seasons[String(ep.season)]
            if (exactSeason?.episodes?.[episodeKey]) rawLink = exactSeason.episodes[episodeKey]

            // fallback — ищем в любом сезоне
            if (!rawLink) {
              for (const season of Object.values(seasons)) {
                if ((season as any)?.episodes?.[episodeKey]) {
                  rawLink = (season as any).episodes[episodeKey]
                  break
                }
              }
            }

            if (!rawLink || typeof rawLink !== 'string') {
              notFound++
              notFoundEpisodes.push(`${animeTitle} — S${ep.season}E${ep.episodeNumber}`)
              continue
            }

            const videoLink = rawLink.startsWith('http') ? rawLink : `https:${rawLink}`

            updates.push(
              req.payload.update({ collection: 'episodes', id: ep.id, data: { videoLink } }),
            )
            updated++
            updatedEpisodes.push(`${animeTitle} — S${ep.season}E${ep.episodeNumber} → ${videoLink}`)
          }
        }

        await Promise.all(updates)

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
            skippedEpisodes,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        )
      },
    },
  ],
}
