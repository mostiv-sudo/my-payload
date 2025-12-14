import fs from 'fs'
import path from 'path'
import { Payload } from 'payload'

type FilmItem = {
  id: number
  anime_genres?: string[]
}

export const seedAddGenreAnime = async (payload: Payload) => {
  console.log('🎯 Привязка жанров к аниме\n')

  // ---------- 1. Загружаем файл ----------
  const filePath = path.join(process.cwd(), 'src/endpoint/tv_material_data.json')

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Файл не найден: ${filePath}`)
    return
  }

  const raw = fs.readFileSync(filePath, 'utf8')
  const films: FilmItem[] = JSON.parse(raw)

  // ---------- 2. Загружаем все жанры ----------
  const genresRes = await payload.find({
    collection: 'genres',
    limit: 1000,
  })

  const genreMap = new Map<string, number>()

  for (const genre of genresRes.docs) {
    if (genre.title) {
      genreMap.set(genre.title.toLowerCase(), genre.id)
    }

    if ((genre as any).external_export_id) {
      genreMap.set(String((genre as any).external_export_id).toLowerCase(), genre.id)
    }
  }

  console.log(`📚 Загружено жанров: ${genreMap.size}`)

  // ---------- 3. Проходимся по аниме ----------
  for (const item of films) {
    if (!item.anime_genres?.length) continue

    // 🔍 ищем аниме по external_export_id
    const animeRes = await payload.find({
      collection: 'anime',
      where: {
        'external_ids.external_export_id': {
          equals: String(item.id),
        },
      },
      limit: 1,
    })

    if (!animeRes.docs.length) {
      console.warn(`⚠ Аниме не найдено (id=${item.id})`)
      continue
    }

    const anime = animeRes.docs[0]

    // ---------- 4. Сопоставляем жанры ----------
    const genreIds: number[] = []

    for (const g of item.anime_genres) {
      const key = g.toLowerCase()
      const genreId = genreMap.get(key)

      if (genreId) {
        genreIds.push(genreId)
      } else {
        console.warn(`⚠ Жанр не найден: "${g}" (anime id=${item.id})`)
      }
    }

    if (!genreIds.length) continue

    // ---------- 5. Обновляем аниме ----------
    await payload.update({
      collection: 'anime',
      id: anime.id,
      data: {
        genres: genreIds,
      },
    })

    console.log(`✅ Обновлены жанры: ${anime.title}`)
  }

  console.log('\n🎉 Жанры успешно привязаны ко всем аниме')
}
