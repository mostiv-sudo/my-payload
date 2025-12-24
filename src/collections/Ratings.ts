import type { CollectionConfig } from 'payload'

export const Ratings: CollectionConfig = {
  slug: 'ratings',

  admin: {
    useAsTitle: 'rating',
    defaultColumns: ['user', 'anime', 'rating', 'createdAt'],
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

  timestamps: true, // 👈 createdAt / updatedAt

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
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 10,
      admin: {
        description: 'Оценка от 1 до 10',
      },
    },
    {
      name: 'comment',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Необязательный комментарий к оценке',
      },
    },
  ],

  indexes: [
    {
      fields: ['user', 'anime'],
      unique: true, // ❗ одна оценка на тайтл
    },
  ],
}
