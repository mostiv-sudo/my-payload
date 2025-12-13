import fs from 'fs'
import path from 'path'
import { Payload } from 'payload'

type ExternalItem = {
  id: number
  kodik_id?: string | null
  shikimori_id?: string | null
  kinopoisk_id?: string | null
  imdb_id?: string | null
  worldart_id?: string | null
}

export const seedExternal = async (payload: Payload) => {
  const filePath = path.join(process.cwd(), 'src/endpoint/film_material_data.json')
  const raw = fs.readFileSync(filePath, 'utf8')
  const data: ExternalItem[] = JSON.parse(raw)

  console.log(`🔗 Обновляем external_ids (${data.length})\n`)

  let updated = 0
  let skipped = 0

  for (const item of data) {
    const exportId = String(item.id)

    // 🔍 ИЩЕМ ПО external_export_id
    const existing = await payload.find({
      collection: 'anime',
      where: {
        'external_ids.external_export_id': {
          equals: exportId,
        },
      },
      limit: 1,
    })

    if (existing.totalDocs === 0) {
      skipped++
      continue
    }

    const anime = existing.docs[0]

    await payload.update({
      collection: 'anime',
      id: anime.id,
      data: {
        external_ids: {
          external_export_id: exportId,
          kodik: item.kodik_id ?? null,
          shikimori: item.shikimori_id ?? null,
          kinopoisk: item.kinopoisk_id ?? null,
          imdb: item.imdb_id ?? null,
          worldart: item.worldart_id ?? null,
        },
      },
    })

    updated++
    console.log(`✅ ${anime.title} — external_ids обновлены`)
  }

  console.log('\n🎉 Готово')
  console.log(`✅ Обновлено: ${updated}`)
  console.log(`⏭ Пропущено: ${skipped}`)
}
