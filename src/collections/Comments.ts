import type { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => false, // обновление комментариев запрещено
    delete: ({ req }) => false, // удаление комментариев запрещено
  },

  timestamps: true, // добавляет createdAt и updatedAt

  fields: [
    {
      name: 'anime',
      type: 'relationship',
      relationTo: 'anime',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users', // id пользователя
    },
    {
      name: 'username',
      type: 'text',
      required: true,
      admin: {
        readOnly: true, // не редактируемое в админке
      },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        // сохраняем имя пользователя на момент создания комментария
        if (req.user && !data.username) {
          data.username = req.user.username || req.user.email || 'Аноним'
        }
        return data
      },
    ],
  },
}
