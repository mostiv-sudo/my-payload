import fs from 'fs/promises'
import path from 'path'
import pLimit from 'p-limit'
import { Payload } from 'payload'
import { mapEpisodesFromJson } from './episodes.mapper'
import { findAnimeByKodikId, findEpisodesByAnime, createEpisode } from './episodes.repository'

const limit = pLimit(5) // ограничение параллельных create

export async function seedEpisodes(payload: Payload) {
  const filePath = path.join(process.cwd(), 'src/endpoint/data/anime.full.json')

  const raw = await fs.readFile(filePath, 'utf8')
  const data = JSON.parse(raw)

  console.log(`📥 Загружено ${data.length} аниме\n`)

  let created = 0
  let skipped = 0

  for (const animeJson of data) {
    const animeDoc = await findAnimeByKodikId(payload, animeJson.id)

    if (!animeDoc) {
      console.log(`⏭ Не найдено: ${animeJson.title}`)
      continue
    }

    const episodes = mapEpisodesFromJson(animeJson)
    if (!episodes.length) continue

    const existing = await findEpisodesByAnime(payload, String(animeDoc.id))

    const existingSet = new Set(existing.map((e) => `${e.season}:${e.episodeNumber}`))

    console.log(`\n🎬 ${animeJson.title}`)

    const tasks = episodes.map((ep) =>
      limit(async () => {
        const key = `${ep.season}:${ep.episodeNumber}`

        if (existingSet.has(key)) {
          skipped++
          console.log(`⏭ S${ep.season}E${ep.episodeNumber}`)
          return
        }

        await createEpisode(payload, {
          ...ep,
          anime: animeDoc.id,
        })

        created++
        console.log(`✅ S${ep.season}E${ep.episodeNumber}`)
      }),
    )

    await Promise.all(tasks)
  }

  console.log(`\n🎉 Seed завершён: создано ${created}, пропущено ${skipped}`)
}
