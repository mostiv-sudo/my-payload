import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Episodes: CollectionConfig = {
  slug: 'episodes',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'anime', 'season', 'episodeNumber', 'released'],
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
      label: 'Аниме',
      required: true,
    },
    {
      name: 'season',
      type: 'number',
      label: 'Сезон',
      required: true,
      defaultValue: 1,
      admin: {
        description: 'Номер сезона, к которому принадлежит эпизод',
      },
    },
    {
      name: 'episodeNumber',
      type: 'number',
      label: 'Номер эпизода',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Название эпизода',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание эпизода',
    },
    {
      name: 'released',
      type: 'date',
      label: 'Дата релиза',
    },
    {
      name: 'duration',
      type: 'number',
      label: 'Длительность (минут)',
    },
    {
      name: 'videoLink',
      type: 'text',
      label: 'Ссылка на видео',
      admin: {
        description: 'Прямая ссылка на эпизод с Kodik API',
      },
    },
    slugField({ fieldToUse: 'title' }),
  ],
}
