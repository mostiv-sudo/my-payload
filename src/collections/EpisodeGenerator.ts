import type { CollectionConfig } from 'payload'

function makeSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

// объединяем дату + время → Date
function combineDateAndTime(date: string, time: string) {
  const [hours = '00', minutes = '00'] = time.split(':')
  const d = new Date(date)
  d.setHours(Number(hours), Number(minutes), 0, 0)
  return d
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
    },
    {
      name: 'season',
      type: 'number',
      required: true,
      defaultValue: 1,
      min: 1,
    },
    {
      name: 'part',
      type: 'text',
      admin: {
        description: 'Часть / арка (опционально)',
      },
    },
    {
      name: 'totalEpisodes',
      type: 'number',
      required: true,
      min: 1,
    },

    // 📅 ДАТА
    {
      name: 'firstAirDay',
      type: 'date',
      required: true,
      admin: {
        description: 'Дата выхода первой серии',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },

    // ⏰ ВРЕМЯ
    {
      name: 'firstAirTime',
      type: 'text',
      required: true,
      defaultValue: '00:00',
      admin: {
        description: 'Время выхода (HH:mm)',
        placeholder: '18:30',
      },
      validate: (val: any) =>
        /^([01]\d|2[0-3]):([0-5]\d)$/.test(val as string) ? true : 'Формат времени HH:mm',
    },

    {
      name: 'stepDays',
      type: 'number',
      defaultValue: 7,
      min: 1,
      admin: {
        description: 'Интервал между сериями (в днях)',
      },
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
          firstAirDay,
          firstAirTime,
          stepDays = 7,
        } = doc

        if (!anime || !totalEpisodes || !firstAirDay || !firstAirTime) return

        const animeDoc = await payload.findByID({
          collection: 'anime',
          id: anime,
        })
        if (!animeDoc) return

        // уже существующие серии
        const existing = await payload.find({
          collection: 'episodes',
          where: {
            anime: { equals: anime },
            season: { equals: season },
          },
          pagination: false,
        })

        const existingNumbers = new Set((existing.docs as any[]).map((e) => e.episodeNumber))

        const startDate = combineDateAndTime(firstAirDay, firstAirTime)

        for (let i = 0; i < totalEpisodes; i++) {
          const episodeNumber = i + 1
          if (existingNumbers.has(episodeNumber)) continue

          const airDate = new Date(startDate)
          airDate.setDate(startDate.getDate() + i * stepDays)

          const partText = part ? `: ${part}` : ''
          const title = `${animeDoc.title}${partText} — Серия ${episodeNumber}`
          const titleEnBase = animeDoc.title_en || animeDoc.title
          const titleEn = `${titleEnBase}${partText} — Episode ${episodeNumber}`

          await payload.create({
            collection: 'episodes',
            data: {
              anime,
              season,
              episodeNumber,
              title,
              released: airDate.toISOString(), // ✅ string
              slug: makeSlug(titleEn),
            },
          })
        }
      },
    ],
  },
}
