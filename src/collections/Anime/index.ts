import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Anime: CollectionConfig = {
  slug: 'anime',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'completion', 'rating', 'year'],
  },

  defaultPopulate: {
    slug: true,
    title: true,
    poster: true,
    rating: true,
    minimal_age: true,
    completion: true,
  },

  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },

  fields: [
    {
      type: 'tabs',
      tabs: [
        // ================= ОСНОВНОЕ =================
        {
          label: 'Основное',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Название',
            },
            {
              name: 'title_en',
              type: 'text',
              required: true,
              unique: true,
              label: 'Название (EN)',
            },
            {
              name: 'play_link',
              type: 'text',
              unique: true,
              label: 'Ссылка на видео',
            },
            {
              name: 'year',
              type: 'number',
              label: 'Год',
              index: true,
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Описание',
            },
            {
              name: 'poster',
              type: 'upload',
              relationTo: 'media',
              label: 'Постер',
            },
            {
              name: 'poster_url',
              type: 'text',
              label: 'Постер URL',
            },

            {
              name: 'rating',
              type: 'number',
              label: 'Оценка',
              defaultValue: 0,
              index: true,
            },
          ],
        },

        {
          name: 'relatedAnime',

          fields: [
            {
              name: 'anime',
              type: 'relationship',
              relationTo: 'anime',
            },
            {
              name: 'relationType',
              type: 'select',
              options: [
                { label: 'Продолжение', value: 'sequel' },
                { label: 'Спин-офф', value: 'spinoff' },
                { label: 'Похожее', value: 'similar' },
              ],
            },
          ],
        },

        // ================= ВНЕШНИЕ ID =================
        {
          label: 'Внешние ID',
          fields: [
            {
              name: 'external_ids',
              type: 'group',
              fields: [
                { name: 'kinopoisk', label: 'Кинопоиск', type: 'text' },
                { name: 'imdb', label: 'IMDB', type: 'text' },
                { name: 'shikimori', label: 'Shikimori', type: 'text' },
                { name: 'kodik', label: 'Kodik', type: 'text' },
                { name: 'external_export_id', label: 'Экспорт', type: 'text' },
              ],
            },
          ],
        },

        // ================= МЕТАДАННЫЕ =================
        {
          label: 'Метаданные',
          fields: [
            {
              name: 'type',
              type: 'select',
              label: 'Тип',
              required: true,
              index: true,
              defaultValue: 'series',
              options: [
                { label: 'Фильм', value: 'movie' },
                { label: 'Сериал', value: 'series' },
              ],
            },
            {
              name: 'genres',
              type: 'relationship',
              relationTo: 'genres',
              hasMany: true,
              label: 'Жанры',
              index: true,
            },
            {
              name: 'studios',
              type: 'relationship',
              relationTo: 'studios',
              hasMany: true,
              label: 'Студии',
            },
            {
              name: 'duration',
              type: 'number',
              label: 'Длительность (мин)',
              admin: {
                condition: (_, data) => data.type === 'movie',
              },
            },
            {
              name: 'seasonsCount',
              type: 'number',
              label: 'Количество сезонов',
              admin: {
                condition: (_, data) => data.type === 'series',
              },
            },
            {
              name: 'episodesCount',
              type: 'number',
              label: 'Количество эпизодов',
              admin: {
                condition: (_, data) => data.type === 'series',
              },
            },
            {
              name: 'minimal_age',
              type: 'number',
              label: 'Минимальный возраст',
              index: true,
            },
            {
              name: 'rating_mpaa',
              type: 'text',
              label: 'Рейтинг MPAA',
            },
          ],
        },
      ],
    },

    // ================= САЙДБАР =================
    {
      name: 'status',
      type: 'select',
      label: 'Статус',
      index: true,
      admin: { position: 'sidebar' },
      defaultValue: 'completed',
      options: [
        { label: 'Анонс', value: 'announced' },
        { label: 'Выходит', value: 'airing' },
        { label: 'Завершено', value: 'completed' },
      ],
    },
    {
      name: 'released',
      type: 'date',
      label: 'Дата релиза',
      admin: { position: 'sidebar' },
    },

    slugField({ fieldToUse: 'title_en' }),
  ],

  hooks: {
    beforeChange: [
      ({ data }) => {
        const requiredFields = ['year', 'description', 'rating', 'minimal_age']

        const relationFields = ['genres', 'studios']

        let total = requiredFields.length + relationFields.length + 1
        let filled = 0
        const issues: { code: string }[] = []

        if (data.poster || data.poster_url) filled++
        else issues.push({ code: 'NO_POSTER' })

        requiredFields.forEach((field) => {
          if (data[field]) filled++
          else issues.push({ code: `NO_${field.toUpperCase()}` })
        })

        relationFields.forEach((field) => {
          if (Array.isArray(data[field]) && data[field].length > 0) filled++
          else issues.push({ code: `NO_${field.toUpperCase()}` })
        })

        if (!data.external_ids?.shikimori) {
          issues.push({ code: 'NO_SHIKIMORI' })
        }

        data.completion = Math.round((filled / total) * 100)
        data.issues = issues

        return data
      },
    ],
  },
}
