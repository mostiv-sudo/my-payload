import fs from 'fs'
import path from 'path'
import { Payload } from 'payload'
import dotenv from 'dotenv'

dotenv.config()

/* -----------------------------------------------------
   Утилиты
----------------------------------------------------- */

/** Простейший slug */
function makeSlug(str: string): string {
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
}

/** Уникальный slug */
async function getUniqueSlug(payload: Payload, base: string): Promise<string> {
  let slug = makeSlug(base)
  let i = 1

  while (true) {
    const exists = await payload.find({
      collection: 'anime',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (exists.totalDocs === 0) return slug

    slug = `${makeSlug(base)}-${i++}`
  }
}

/** Тип: фильм / сериал */
function mapType(type: any): 'movie' | 'series' {
  if (!type) return 'movie'
  const t = String(type).toLowerCase()
  return t.includes('serial') || t.includes('series') || t.includes('tv') ? 'series' : 'movie'
}

/** Статус */
function mapStatus(status: any): 'announced' | 'airing' | 'completed' {
  if (!status) return 'announced'
  const s = String(status).toLowerCase()
  if (s === 'ongoing') return 'airing'
  if (s === 'released') return 'completed'
  return 'announced'
}

/* -----------------------------------------------------
   Маппинг JSON → Payload
----------------------------------------------------- */

function mapAnime(item: any) {
  const type = mapType(item.type)

  return {
    title: item.title,
    title_en: item.enTitle || item.title,
    year: item.year ?? null,
    description: item.description || '',
    rating: item.shikimori_rating ?? 0,

    type,

    duration: type === 'movie' ? (item.duration ?? null) : null,
    seasonsCount: type === 'series' ? 1 : null,
    episodesCount: type === 'series' ? (item.episodes_total ?? null) : null,

    status: mapStatus(item.status),
    relesed: item.released_at ?? null,

    external_ids: {
      kinopoisk: item.kinopoisk_id ?? '',
      imdb: item.imdb_id ?? '',
      worldart: item.worldart_id ?? '',
      external_export_id: String(item.id), // 🔥 ГЛАВНОЕ
    },
  }
}

/* -----------------------------------------------------
   SEED
----------------------------------------------------- */

export const seed = async (payload: Payload) => {
  const filePath = path.join(process.cwd(), 'src/endpoint/film.json')
  const raw = fs.readFileSync(filePath, 'utf8')
  const data = JSON.parse(raw)

  console.log(`📥 Импортируем ${data.length} записей...\n`)

  for (const item of data) {
    const anime = mapAnime(item)

    // fallback
    if (!anime.title_en) {
      anime.title_en = anime.title
    }

    // ищем по UNIQUE title_en
    const existing = await payload.find({
      collection: 'anime',
      where: {
        title_en: {
          equals: anime.title_en,
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      const existingDoc = existing.docs[0]

      // обновляем существующую запись
      await payload.update({
        collection: 'anime',
        id: existingDoc.id,
        data: {
          ...anime,
          slug: existingDoc.slug, // slug НЕ трогаем
        },
      })

      console.log(`🔁 Обновлено: ${anime.title_en}`)
      continue
    }

    // если записи нет — создаём
    const slug = await getUniqueSlug(payload, anime.title_en)

    await payload.create({
      collection: 'anime',
      data: {
        ...anime,
        slug,
      },
    })

    console.log(`✅ Добавлено: ${anime.title_en} (slug: ${slug})`)
  }

  console.log('\n🎉 Импорт завершён.')
  process.exit(0)
}
