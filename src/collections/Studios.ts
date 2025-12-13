import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Studios: CollectionConfig = {
  slug: 'studios',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Название студии',
    },

    {
      name: 'country',
      type: 'text',
      label: 'Страна',
    },

    {
      name: 'founded',
      type: 'number',
      label: 'Год основания',
    },

    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
    },

    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Логотип',
    },

    slugField(),
  ],
}
