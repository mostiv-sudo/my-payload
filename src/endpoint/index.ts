import { Payload } from 'payload'

import { seedAnime } from './steps/anime.seed'
import { seedEpisodes } from './steps/episodes/episodes.seed'
import { seedGenres } from './steps/genres/genres.seed'
import { seedAddGenreAnime } from './steps/anime-genres.seed'
import { seedUpcomingEpisodes } from './steps/episodes/episodes.upcoming.seed'

type SeedMode = 'anime' | 'episodes' | 'upcoming' | 'genres' | 'add-genres' | 'full'

export async function seed(payload: Payload) {
  const mode = process.env.SEED as SeedMode | undefined

  console.log(`🌱 SEED режим: ${mode ?? 'не задан'}\n`)

  try {
    switch (mode) {
      case 'anime':
        await seedAnime(payload)
        break

      case 'episodes':
        await seedEpisodes(payload)
        break

      case 'genres':
        await seedGenres(payload)
        break
      case 'upcoming':
        await seedUpcomingEpisodes(payload)
        break

      case 'add-genres':
        await seedAddGenreAnime(payload)
        break

      case 'full':
        await seedAnime(payload)
        await seedGenres(payload)
        await seedAddGenreAnime(payload)
        await seedEpisodes(payload)
        await seedUpcomingEpisodes(payload)
        break

      default:
        console.log(
          '🚫 Неизвестный SEED режим\n' +
            'Доступные режимы:\n' +
            ' - anime\n' +
            ' - episodes\n' +
            ' - genres\n' +
            ' - add-genres\n' +
            ' - full',
        )
    }
  } catch (err) {
    console.error('❌ Ошибка во время seed:', err)
    throw err
  }

  console.log('\n✅ SEED завершён')
}
