import type { CollectionConfig } from 'payload'

export const Bookmarks: CollectionConfig = {
  slug: 'bookmarks',

  admin: {
    useAsTitle: 'anime',
    defaultColumns: ['user', 'anime', 'status', 'createdAt'],
  },

  access: {
    read: ({ req }) => !!req.user,

    create: ({ req }) => !!req.user,

    update: ({ req }) => {
      if (!req.user) return false

      return {
        user: {
          equals: req.user.id,
        },
      }
    },

    delete: ({ req }) => {
      if (!req.user) return false

      return {
        user: {
          equals: req.user.id,
        },
      }
    },
  },

  timestamps: true,

  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'anime',
      type: 'relationship',
      relationTo: 'anime',
      required: true,
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'planned',
      options: [
        { label: 'Запланировано', value: 'planned' },
        { label: 'Просмотрено', value: 'completed' },
      ],
      admin: {
        description: 'Статус просмотра',
      },
    },
  ],

  indexes: [
    {
      fields: ['user', 'anime'],
      unique: true, // ❗ одна закладка на тайтл
    },
  ],
}
