import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Genres: CollectionConfig = {
  slug: 'genres',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Название жанра',
    },

    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
    },

    slugField(),
  ],
}
