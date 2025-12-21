import fs from 'fs'
import path from 'path'
import { Payload } from 'payload'
import { episodeExists, createEpisode } from './episodes.repository'
import { mapUpcomingEpisode } from './mapUpcomingEpisode'

export async function findAnimeByShikimoriId2(payload: Payload, shikimoriId: string | number) {
  const id = String(shikimoriId)

  const res = await payload.find({
    collection: 'anime',
    where: {
      'external_ids.shikimori': {
        equals: id,
      },
    },
    limit: 1,
  })

  return res.docs[0] ?? null
}

export async function seedUpcomingEpisodes(payload: Payload) {
  const filePath = path.join(process.cwd(), 'src/endpoint/data/calendar.json')

  const raw = fs.readFileSync(filePath, 'utf8')
  const data = JSON.parse(raw)

  console.log(`📅 Найдено upcoming аниме: ${data.length}\n`)

  for (const item of data) {
    const animeDoc = await findAnimeByShikimoriId2(payload, String(item.anime.id))

    if (!animeDoc) {
      console.log(`⏭ Аниме не найдено: ${item.anime.name}`)
      continue
    }

    const episode = mapUpcomingEpisode(item)
    if (!episode) continue

    const exists = await episodeExists(
      payload,
      String(animeDoc.id),
      episode.season,
      episode.episodeNumber,
    )

    if (exists) {
      console.log(`⏭ Уже есть E${episode.episodeNumber}`)
      continue
    }

    await createEpisode(payload, {
      ...episode,
      anime: animeDoc.id,
    })

    // 🔥 Если есть upcoming — значит аниме выходит
    if (animeDoc.status !== 'airing') {
      await payload.update({
        collection: 'anime',
        id: animeDoc.id,
        data: {
          status: 'airing',
        },
      })
    }

    console.log(`🕒 Запланирован эпизод E${episode.episodeNumber} (${episode.released})`)
  }

  console.log('\n✅ Upcoming эпизоды добавлены')
}
