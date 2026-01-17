import type { CollectionConfig } from 'payload'
import type { User } from '@/payload-types'

import { protectRoles } from './protectRoles'
import { userSelfOrAdmin } from './access/userSelfOrAdmin'
import { adminOnly } from './access/adminOnly'
import { anyone } from './access/anyone'
import { checkRole } from './access/checkRole'

export const Users: CollectionConfig = {
  slug: 'users',

  auth: {
    tokenExpiration: 60 * 60 * 24 * 14,
    verify: false,
  },

  admin: {
    useAsTitle: 'email',
  },

  access: {
    create: anyone, // регистрация
    read: userSelfOrAdmin, // ТОЛЬКО себя (или admin)
    update: userSelfOrAdmin, // ТОЛЬКО себя (или admin)
    delete: adminOnly, // удаление — только admin
  },

  fields: [
    {
      name: 'username',
      type: 'text',
      label: 'Имя пользователя',
      defaultValue: '',
      admin: {
        description: 'Можно изменить в настройках профиля',
      },
      access: {
        create: () => false,
        update: ({ req, id }) => req.user?.id === id,
      },
    },

    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['user'],
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'User', value: 'user' },
      ],
      hooks: {
        beforeChange: [protectRoles],
      },
      access: {
        update: ({ req }) => checkRole(['admin'], req.user as User | undefined),
      },
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
