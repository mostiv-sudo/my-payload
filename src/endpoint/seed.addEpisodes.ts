import { Payload } from 'payload'

type KodikEpisodeData = {
  id: string
  title: string
  episodes_count: number
  seasons?: Record<
    string,
    {
      link: string
      episodes?: Record<string, string>
    }
  >
  material_data: {
    title: string
    anime_title: string
    title_en: string
    duration: number
    anime_genres: string[]
  }
}

function makeSlug(str: string): string {
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .substring(0, 100)
}

export const seedEpisodes = async (payload: Payload) => {
  const animeList = await payload.find({
    collection: 'anime',
    where: {
      type: { equals: 'movie' },
    },
    limit: 6000,
  })

  if (!animeList.totalDocs || animeList.docs.length === 0) {
    console.error('Аниме не найдено в базе')
    return
  }

  for (const anime of animeList.docs) {
    const kodikId = anime.external_ids?.kodik
    if (!kodikId) {
      console.log(`Пропущено аниме без Kodik ID: ${anime.title}`)
      continue
    }

    console.log(`\n🔍 Обработка аниме: ${anime.title} (Kodik ID: ${kodikId})`)

    const apiUrl = `https://kodikapi.com/search?token=6a99de2e4189a853b6b87ead73d11dd5&id=${kodikId}&with_episodes=true&with_material_data=true`
    try {
      const res = await fetch(apiUrl)
      if (!res.ok) {
        console.error('Ошибка Kodik API:', res.statusText)
        continue
      }

      const json = await res.json()
      const animeData: KodikEpisodeData = json.results[0]
      if (!animeData || !animeData.seasons) {
        console.log(`⚠ Нет сезонов для ${anime.title}, пропускаем`)
        continue
      }

      for (const seasonNum of Object.keys(animeData.seasons)) {
        const season = animeData.seasons[seasonNum]
        if (!season || !season.episodes) continue

        for (const epNum of Object.keys(season.episodes)) {
          const episodeNumber = Number(epNum)
          const episodeSlug = makeSlug(`${anime.id}-${seasonNum}-${episodeNumber}`)
          const videoLink = season.episodes[epNum].startsWith('//')
            ? `https:${season.episodes[epNum]}`
            : season.episodes[epNum]

          const exists = await payload.find({
            collection: 'episodes',
            where: {
              anime: { equals: anime.id },
              season: { equals: Number(seasonNum) },
              episodeNumber: { equals: episodeNumber },
            },
            limit: 1,
          })

          if (exists.totalDocs > 0) {
            console.log(`⚠ Пропущен: ${anime.title} Сезон ${seasonNum} Эпизод ${episodeNumber}`)
            continue
          }

          await payload.create({
            collection: 'episodes',
            data: {
              anime: anime.id,
              season: Number(seasonNum),
              episodeNumber,
              title: `Episode ${episodeNumber}`,
              description: '',
              duration: animeData.material_data.duration || 0,
              released: null,
              slug: episodeSlug,
              videoLink,
            },
            draft: false,
          })

          console.log(`✅ Добавлен: ${anime.title} Сезон ${seasonNum} Эпизод ${episodeNumber}`)
        }
      }
    } catch (err) {
      console.error('Ошибка при обработке аниме:', anime.title, err)
    }
  }

  console.log('\n🎉 Все эпизоды успешно добавлены')
}
