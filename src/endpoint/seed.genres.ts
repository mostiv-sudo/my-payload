import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Payload } from 'payload'

type GenreItem = {
  genre: string
  english_name: string
  description?: string
}

/**
 * Простой slug без зависимостей
 */
function makeSlug(str: string): string {
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
}

/**
 * Абсолютный путь к текущей папке файла
 */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const seedGenres = async (payload: Payload) => {
  const filePath = path.resolve(__dirname, 'list_genre.json')

  // ✅ Проверка существования файла
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Файл не найден: ${filePath}`)
    console.error('👉 Проверь имя и расположение list_genre.json')
    return
  }

  let data: GenreItem[]

  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    data = JSON.parse(raw)
  } catch (err) {
    console.error('❌ Ошибка чтения или парсинга list_genre.json')
    console.error(err)
    return
  }

  console.log(`📥 Импорт жанров: ${data.length}\n`)

  for (const item of data) {
    if (!item.genre || !item.english_name) {
      console.warn('⚠ Пропуск некорректной записи:', item)
      continue
    }

    const slug = makeSlug(item.english_name)

    const exists = await payload.find({
      collection: 'genres',
      where: {
        slug: { equals: slug },
      },
      limit: 1,
    })

    if (exists.totalDocs > 0) {
      console.log(`⚠ Уже существует: ${slug}`)
      continue
    }

    await payload.create({
      collection: 'genres',
      draft: false,
      data: {
        title: item.genre,
        title_en: item.english_name,
        description: item.description || '',
        slug,
      },
    })

    console.log(`✅ Добавлен жанр: ${item.genre}`)
  }

  console.log('\n🎉 Импорт жанров завершён')
}
