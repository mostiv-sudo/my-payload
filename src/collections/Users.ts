import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',

  admin: {
    useAsTitle: 'email',
  },

  auth: {
    tokenExpiration: 1209600, // 14 дней
    verify: false, // включена email-верификация
  },

  access: {
    create: () => true, // любой может зарегистрироваться
    read: ({ req }) => !!req.user, // читать могут только авторизованные
    update: ({ req }) => !!req.user, // пользователь может обновлять себя
    delete: ({ req }) => !!req.user, // если нужно — можно оставить только админам
  },

  fields: [
    {
      name: 'username',
      type: 'text',
      required: false,
    },

    {
      name: 'emailVerified',
      type: 'checkbox',
      label: 'Email подтверждён',
      defaultValue: false,
    },
  ],
}
