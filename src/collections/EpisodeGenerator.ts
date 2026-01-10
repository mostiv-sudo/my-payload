import type { CollectionConfig } from 'payload'

function makeSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-') // пробелы -> дефис
    .replace(/[^\w\-]+/g, '') // удалить все кроме букв, цифр и дефисов
    .replace(/\-\-+/g, '-') // двойные дефисы -> один
    .replace(/^-+/, '') // убрать дефис в начале
    .replace(/-+$/, '') // убрать дефис в конце
}

export const EpisodeGenerator: CollectionConfig = {
  slug: 'episode-generator',

  admin: {
    useAsTitle: 'anime',
    description: 'Генерация эпизодов для выбранного аниме',
  },

  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },

  fields: [
    {
      name: 'anime',
      type: 'relationship',
      relationTo: 'anime',
      required: true,
      admin: { description: 'Выберите аниме, для которого будут созданы эпизоды' },
    },
    {
      name: 'season',
      type: 'number',
      required: true,
      defaultValue: 1,
      min: 1,
      admin: { description: 'Сезон, к которому относятся эпизоды' },
    },
    {
      name: 'part',
      type: 'text',
      admin: { description: 'Часть/арка (например, Zenpen, Kouhen)' },
    },
    {
      name: 'totalEpisodes',
      type: 'number',
      required: true,
      min: 1,
      admin: { description: 'Общее количество эпизодов для генерации' },
    },
    {
      name: 'firstAirDate',
      type: 'date',
      required: true,
      admin: { description: 'Дата и время выхода первой серии' },
    },
    {
      name: 'stepDays',
      type: 'number',
      defaultValue: 7,
      min: 1,
      admin: { description: 'Шаг между сериями в днях' },
    },
    {
      name: 'stepHours',
      type: 'number',
      defaultValue: 0,
      min: 0,
      max: 23,
      admin: { description: 'Шаг между сериями в часах (дополнительно к дням)' },
    },
    {
      name: 'stepMinutes',
      type: 'number',
      defaultValue: 0,
      min: 0,
      max: 59,
      admin: { description: 'Шаг между сериями в минутах (дополнительно к дням)' },
    },
  ],

  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        const { payload } = req
        const {
          anime,
          season = 1,
          part,
          totalEpisodes,
          firstAirDate,
          stepDays = 7,
          stepHours = 0,
          stepMinutes = 0,
        } = doc

        if (!anime || !totalEpisodes || !firstAirDate) return

        const animeDoc = await payload.findByID({
          collection: 'anime',
          id: anime,
        })
        if (!animeDoc) return

        const start = new Date(firstAirDate)

        for (let i = 0; i < totalEpisodes; i++) {
          const airDate = new Date(start)
          airDate.setDate(start.getDate() + i * stepDays)
          airDate.setHours(start.getHours() + i * stepHours)
          airDate.setMinutes(start.getMinutes() + i * stepMinutes)

          // Формируем название серии
          const partText = part ? `: ${part}` : ''
          const title = `${animeDoc.title}${partText} — Серия ${i + 1}`
          const title_en = `${animeDoc.title_en}${partText} — Episode ${i + 1}`
          const slug = makeSlug(title_en)

          await payload.create({
            collection: 'episodes',
            draft: false,
            data: {
              anime,
              season,
              episodeNumber: i + 1,
              title,

              released: airDate.toISOString(),
              slug,
            },
          })
        }
      },
    ],
  },
}
