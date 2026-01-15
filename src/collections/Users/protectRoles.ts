import type { FieldHook } from 'payload'
import type { User } from '@/payload-types'

type Role = NonNullable<User['roles']>[number]

export const protectRoles: FieldHook<User> = async ({ req, value }) => {
  const payload = req.payload

  // 🟢 Проверяем, есть ли уже пользователи
  const { totalDocs } = await payload.find({
    collection: 'users',
    limit: 1,
  })

  const isFirstUser = totalDocs === 0
  const isAdmin = req.user?.roles?.includes('admin')

  // 🥇 Первый пользователь → admin + user
  if (isFirstUser) {
    return ['admin', 'user']
  }

  // ❌ Не админ → всегда только user
  if (!isAdmin) {
    return ['user']
  }

  // ✅ Админ → можно расширять роли, но user всегда есть
  const roles = new Set<Role>(Array.isArray(value) ? value : [])
  roles.add('user')

  return [...roles]
}
