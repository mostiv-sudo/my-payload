import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Genres: CollectionConfig = {
  slug: 'genres',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true, // ✅ публичный доступ для чтения
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Название жанра',
    },
    {
      name: 'title_en',
      type: 'text',
      required: true,
      label: 'Название жанра en',
    },

    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
    },

    slugField({ fieldToUse: 'title_en' }),
  ],
}
