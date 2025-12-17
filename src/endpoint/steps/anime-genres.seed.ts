import fs from 'fs'
import path from 'path'
import { Payload } from 'payload'

type FilmItem = {
  id: string // поле из JSON, содержит kodik ID с префиксом serial- или movie-
  slug: string
  anime_genres?: string[]
}

function normalize(value: string) {
  return value.trim().toLowerCase()
}

export const seedAddGenreAnime = async (payload: Payload) => {
  console.log('🎯 Привязка жанров к аниме по Kodik ID\n')

  // ---------- 1. Загружаем JSON ----------
  const filePath = path.join(process.cwd(), 'src/endpoint/data/anime.full.json')
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Файл не найден: ${filePath}`)
    return
  }

  const raw = fs.readFileSync(filePath, 'utf8')
  const films: FilmItem[] = JSON.parse(raw)

  console.log(`📥 Загружено аниме из JSON: ${films.length}`)

  // ---------- 2. Загружаем жанры ----------
  const genresRes = await payload.find({
    collection: 'genres',
    limit: 1000,
  })

  const genreMap = new Map<string, number>()
  for (const genre of genresRes.docs) {
    if (genre.title) genreMap.set(normalize(genre.title), Number(genre.id))
    if ((genre as any).title_en) genreMap.set(normalize((genre as any).title_en), Number(genre.id))
  }

  console.log(`📚 Загружено жанров: ${genreMap.size}`)

  // ---------- 3. Привязываем жанры ----------
  for (const item of films) {
    if (!item.anime_genres?.length) continue

    // Ищем аниме по external_ids.kodik
    const animeRes = await payload.find({
      collection: 'anime',
      where: {
        'external_ids.kodik': {
          equals: item.id, // Сравниваем JSON.id с external_ids.kodik
        },
      },
      limit: 1,
    })

    if (!animeRes.docs.length) {
      console.warn(`⚠ Аниме не найдено (kodik=${item.id}, slug=${item.slug})`)
      continue
    }

    const anime = animeRes.docs[0]

    const genreIds = item.anime_genres
      .map((g) => genreMap.get(normalize(g)))
      .filter(Boolean) as number[]

    if (!genreIds.length) continue

    // Обновляем relationship жанров в Payload
    await payload.update({
      collection: 'anime',
      id: anime.id,
      data: {
        genres: genreIds.map((id) => ({ id })), // правильный тип для relationship
      },
    })

    console.log(`✅ Жанры обновлены: ${anime.title} (${item.slug})`)
  }

  console.log('\n🎉 Привязка жанров завершена')
}
