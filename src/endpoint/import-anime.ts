import fs from 'fs'
import path from 'path'
import { Payload } from 'payload'
import dotenv from 'dotenv'

dotenv.config()

/** Простая генерация slug */
function makeSlug(str: string): string {
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
}

/** Уникальный slug (если есть дубли) */
async function getUniqueSlug(payload: Payload, base: string) {
  let slug = makeSlug(base)
  let suffix = 1

  while (true) {
    const exists = await payload.find({
      collection: 'anime',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (exists.totalDocs === 0) return slug

    slug = `${makeSlug(base)}-${suffix++}`
  }
}

/** Определяем тип */
function mapType(type: any): 'movie' | 'series' {
  if (!type) return 'movie'
  const t = String(type).toLowerCase()
  return t.includes('serial') || t.includes('series') || t.includes('tv') ? 'series' : 'movie'
}

/** Определяем статус */
function mapStatus(status: any): 'announced' | 'airing' | 'completed' {
  if (!status) return 'announced'
  const s = String(status).toLowerCase()
  if (s === 'ongoing') return 'airing'
  if (s === 'released') return 'completed'
  return 'announced'
}

/** JSON → формат коллекции */
function mapAnime(item: any) {
  const type = mapType(item.type)

  return {
    title: item.title,
    title_en: item.enTitle,
    year: item.year ?? null,
    description: item.description || '',
    rating: item.shikimori_rating ?? null,
    slug: item.enTitle,

    type,

    duration: type === 'movie' ? (item.duration ?? null) : null,
    seasonsCount: type === 'series' ? 1 : null,
    episodesCount: type === 'series' ? (item.episodes_total ?? null) : null,

    status: mapStatus(item.status),
    relesed: item.released_at ?? null,

    external_ids: {
      kinopoisk: '',
      imdb: '',
      worldart: '',
    },
  }
}

export const seed = async (payload: Payload) => {
  const filePath = path.join(process.cwd(), 'src/endpoint/tv.json')
  const raw = fs.readFileSync(filePath, 'utf8')
  const data = JSON.parse(raw)

  console.log(`📥 Импортируем ${data.length} записей...\n`)

  for (const item of data) {
    const anime = mapAnime(item)

    // Если нет title_en — делаем фейковый
    if (!anime.title_en) {
      anime.title_en = anime.title
    }

    // Пропуск дублей по title_en
    const existing = await payload.find({
      collection: 'anime',
      where: { title_en: { equals: anime.title_en } },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      console.log(`⚠ Пропуск (дубликат): ${anime.title_en}`)
      continue
    }

    // Генерируем уникальный slug
    const slug = await getUniqueSlug(payload, anime.title_en)
    anime.slug = slug

    await payload.create({
      collection: 'anime',
      data: anime,
      draft: false,
    })

    console.log(`✅ Добавлено: ${anime.title} (slug: ${slug})`)
  }

  console.log('\n🎉 Импорт завершён.')
  process.exit()
}
