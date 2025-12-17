import fs from 'fs'
import path from 'path'
import { Payload } from 'payload'
import { mapEpisodesFromJson } from './episodes.mapper'
import { findAnimeByKodikId, episodeExists, createEpisode } from './episodes.repository'

export async function seedEpisodes(payload: Payload) {
  const filePath = path.join(process.cwd(), 'src/endpoint/data/anime.full.json')

  const raw = fs.readFileSync(filePath, 'utf8')
  const data = JSON.parse(raw)

  console.log(`📥 Загружено ${data.length} аниме из JSON\n`)

  for (const animeJson of data) {
    const animeDoc = await findAnimeByKodikId(payload, animeJson.id)

    if (!animeDoc) {
      console.log(`⏭ Аниме не найдено в БД: ${animeJson.title}`)
      continue
    }

    const episodes = mapEpisodesFromJson(animeJson)

    if (!episodes.length) {
      console.log(`⚠ Нет эпизодов: ${animeJson.title}`)
      continue
    }

    console.log(`\n🎬 ${animeJson.title}`)

    for (const ep of episodes) {
      const exists = await episodeExists(payload, String(animeDoc.id), ep.season, ep.episodeNumber)

      if (exists) {
        console.log(`⏭ S${ep.season}E${ep.episodeNumber}`)
        continue
      }

      await createEpisode(payload, {
        ...ep,
        anime: animeDoc.id,
      })

      console.log(`✅ S${ep.season}E${ep.episodeNumber}`)
    }
  }

  console.log('\n🎉 Seed эпизодов завершён')
}
