import fs from 'fs'
import path from 'path'
import { Payload } from 'payload'
import { mapAnime } from './anime.mapper'
import { getUniqueSlug } from './utils/slug'
import { findByTitleEn, createAnime, updateAnime } from './anime.repository'
import { ExternalAnime } from './types/external-anime'

export async function seedAnime(payload: Payload) {
  const filePath = path.join(process.cwd(), 'src/endpoint/data/anime.full.json')

  const raw = fs.readFileSync(filePath, 'utf8')
  const data: ExternalAnime[] = JSON.parse(raw)

  console.log(`📥 Импортируем ${data.length} записей...\n`)

  for (const item of data) {
    const anime = mapAnime(item)

    if (!anime.title_en) anime.title_en = anime.title

    const existing = await findByTitleEn(payload, anime.title_en)

    if (existing) {
      await updateAnime(payload, String(existing.id), {
        ...anime,
        slug: existing.slug,
      })

      console.log(`🔁 Обновлено: ${anime.title_en}`)
      continue
    }

    const slug = await getUniqueSlug(payload, anime.title_en)

    await createAnime(payload, {
      ...anime,
      slug,
    })

    console.log(`✅ Добавлено: ${anime.title_en}`)
  }

  console.log('\n🎉 Seed завершён')
}
