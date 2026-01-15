import type { User } from '@/payload-types'

export const checkRole = (allowedRoles?: User['roles'] | null, user?: User | null): boolean => {
  if (!allowedRoles?.length) return false
  if (!user?.roles?.length) return false

  return allowedRoles.some((role) => user.roles!.includes(role))
}
