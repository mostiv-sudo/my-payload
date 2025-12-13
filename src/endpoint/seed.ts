import type { Payload } from 'payload'

export const seed = async (payload: Payload) => {
  console.log('Seeding anime data...')

  const animeList = [
    {
      title: 'Тетрадь смерти',
      title_en: 'Death Note',
      year: 2006,
      description: 'Гениальный школьник получает тетрадь...',
      rating: 9.0,
      type: 'series',
      slug: 'death-note',
    },
    {
      title: 'Атака титанов',
      title_en: 'Attack on Titan',
      year: 2013,
      description: 'История о людях за стенами...',
      rating: 9.1,
      type: 'series',
      slug: 'attack-on-titan',
    },
    {
      title: 'Твоё имя',
      title_en: 'Your Name',
      year: 2016,
      description: 'Два подростка меняются телами...',
      rating: 8.9,
      type: 'movie',
      slug: 'your-name',
    },
  ] as const

  for (const anime of animeList) {
    await payload.create({
      collection: 'anime',
      data: anime,
      draft: false, // важно!
    })
  }

  console.log('Anime seed completed.')
}
