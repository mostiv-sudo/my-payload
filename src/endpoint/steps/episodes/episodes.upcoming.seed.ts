import fs from 'fs'
import path from 'path'
import { Payload } from 'payload'
import { episodeExists, createEpisode } from './episodes.repository'
import { mapUpcomingEpisode } from './mapUpcomingEpisode'

export async function findAnimeByShikimoriId(payload: Payload, shikimoriId: string | number) {
  const res = await payload.find({
    collection: 'anime',
    where: {
      'external_ids.shikimori': {
        equals: String(shikimoriId),
      },
    },
    limit: 1,
  })

  return res.docs?.[0] ?? null
}

export async function seedUpcomingEpisodes(payload: Payload) {
  const filePath = path.join(process.cwd(), 'src/endpoint/data/calendar.json')

  if (!fs.existsSync(filePath)) {
    console.warn('⚠ calendar.json не найден')
    return
  }

  const data: any[] = JSON.parse(fs.readFileSync(filePath, 'utf8'))

  console.log(`📅 Найдено upcoming аниме: ${data.length}\n`)

  let addedCount = 0
  let skippedCount = 0
  let notFoundCount = 0

  for (const item of data) {
    // Пропускаем, если нет anime или id
    if (!item?.anime?.id) {
      console.log('⏭ Пропущен элемент без anime.id')
      skippedCount++
      continue
    }

    const animeDoc = await findAnimeByShikimoriId(payload, item.anime.id)

    if (!animeDoc) {
      console.log(`⏭ Аниме не найдено: ${item.anime.name ?? item.anime.id}`)
      notFoundCount++
      continue
    }

    const episode = mapUpcomingEpisode(item)

    if (!episode) {
      console.log(`⏭ Эпизод не найден для: ${item.anime.name ?? item.anime.id}`)
      skippedCount++
      continue
    }

    const exists = await episodeExists(
      payload,
      String(animeDoc.id),
      episode.season,
      episode.episodeNumber,
    )

    if (exists) {
      console.log(`⏭ Уже есть E${episode.episodeNumber} для ${item.anime.name}`)
      skippedCount++
      continue
    }

    await createEpisode(payload, {
      ...episode,
      anime: animeDoc.id, // ✅ только ID
    })

    addedCount++
    console.log(
      `🕒 Добавлен эпизод: ${item.anime.name} — E${episode.episodeNumber} (${episode.released})`,
    )
  }

  console.log(
    `\n✅ Итог: Добавлено: ${addedCount}, Пропущено: ${skippedCount}, Аниме не найдено: ${notFoundCount}`,
  )
}
