import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Anime: CollectionConfig = {
  slug: 'anime',
  admin: {
    useAsTitle: 'title',
  },

  // --- Какие поля заполнять автоматически ---
  defaultPopulate: {
    slug: true,
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
        // --- ОСНОВНОЕ ---
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
              name: 'year',
              type: 'number',
              label: 'Год',
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
              name: 'rating',
              type: 'number',
              label: 'Оценка',
              defaultValue: 0,
            },
          ],
        },

        // --- СЕКЦИЯ ВНЕШНИХ ID ---
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
                { name: 'worldart', label: 'WorldArt', type: 'text' },
                { name: 'external_export_id', label: 'Экспорт', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Метаданные',
          fields: [
            {
              name: 'type',
              type: 'select',
              label: 'Тип',
              required: true,
              defaultValue: 'movie',
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
          ],
        },
      ],
    },

    // Статус можно вынести в сайдбар
    {
      name: 'status',
      type: 'select',
      label: 'Статус',
      admin: {
        position: 'sidebar',
      },
      defaultValue: 'completed',
      options: [
        { label: 'Анонс', value: 'announced' },
        { label: 'Выходит', value: 'airing' },
        { label: 'Завершено', value: 'completed' },
      ],
    },
    {
      name: 'relesed',
      type: 'date',
      label: 'Дата релиза',
      admin: {
        position: 'sidebar',
      },
    },

    slugField({ fieldToUse: 'title_en' }),
  ],
}
