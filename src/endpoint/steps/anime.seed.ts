import fs from 'fs'
import path from 'path'
import { Payload } from 'payload'
import { mapAnime } from './anime.mapper'
import { getUniqueSlug } from './utils/slug'
import { findByTitleEn, createAnime, updateAnime, findByExternalId } from './anime.repository'
import { ExternalAnime } from './types/external-anime'

export async function seedAnime(payload: Payload) {
  const filePath = path.join(process.cwd(), 'src/endpoint/data/anime.full.json')

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Файл не найден: ${filePath}`)
    return
  }

  const data: ExternalAnime[] = JSON.parse(fs.readFileSync(filePath, 'utf8'))

  let created = 0
  let updated = 0
  let skipped = 0
  let errors = 0

  console.log(`📥 Импортируем ${data.length} записей...\n`)

  for (const item of data) {
    try {
      const anime = mapAnime(item)
      if (!anime.title_en) anime.title_en = anime.title

      const existing = anime.external_ids?.shikimori
        ? await findByExternalId(payload, 'shikimori', anime.external_ids.shikimori)
        : await findByTitleEn(payload, anime.title_en)

      if (existing) {
        await updateAnime(payload, existing.id, {
          ...anime,
          slug: existing.slug,
        })
        updated++
        console.log(`🔁 ${anime.title_en}`)
        continue
      }

      const slug = await getUniqueSlug(payload, anime.title_en)

      await createAnime(payload, {
        ...anime,
        slug,
      })

      created++
      console.log(`✅ ${anime.title_en}`)
    } catch (e) {
      errors++
      console.error(`❌ Ошибка импорта:`, e)
    }
  }

  console.log(`
🎉 Seed завершён
➕ Добавлено: ${created}
🔁 Обновлено: ${updated}
❌ Ошибок: ${errors}
`)
}
