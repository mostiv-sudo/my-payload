import fs from 'fs'
import path from 'path'
import { Payload } from 'payload'

type FilmItem = {
  id: string // Kodik ID
  slug: string
  shikimori_id?: number
  anime_genres?: string[]
}

function normalize(value: string) {
  return value.trim().toLowerCase()
}

export const seedAddGenreAnimeByShikimori = async (payload: Payload) => {
  console.log('🎯 Привязка жанров к аниме по Shikimori ID\n')

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
  let updatedCount = 0

  for (const item of films) {
    if (!item.anime_genres?.length || !item.shikimori_id) continue

    // Ищем аниме по shikimori_id
    const animeRes = await payload.find({
      collection: 'anime',
      where: { 'external_ids.shikimori': { equals: String(item.shikimori_id) } },
      limit: 1,
    })

    if (!animeRes.docs.length) {
      console.warn(`⚠ Аниме не найдено (shikimori_id=${item.shikimori_id}, slug=${item.slug})`)
      continue
    }

    const anime = animeRes.docs[0]

    // Существующие жанры в формате {id: number}
    const existingGenresObjects = Array.isArray(anime.genres)
      ? (anime.genres
          .map((g) => {
            if (typeof g === 'number') return { id: g }
            if (typeof g === 'object' && 'id' in g) return { id: Number(g.id) }
            return null
          })
          .filter(Boolean) as { id: number }[])
      : []

    // Новые жанры
    const genreIdsToAdd = item.anime_genres
      .map((g) => genreMap.get(normalize(g)))
      .filter((id): id is number => !!id && !existingGenresObjects.some((e) => e.id === id))

    if (!genreIdsToAdd.length) {
      console.log(`ℹ Нет новых жанров для ${anime.title}`)
      continue
    }

    const updatedGenres = [...existingGenresObjects, ...genreIdsToAdd.map((id) => ({ id }))]

    await payload.update({
      collection: 'anime',
      id: anime.id,
      data: { genres: updatedGenres },
    })

    updatedCount++
    console.log(`✅ Жанры обновлены: ${anime.title} (${item.slug})`)
  }

  console.log(`\n🎉 Привязка жанров завершена. Обновлено аниме: ${updatedCount}`)
}
