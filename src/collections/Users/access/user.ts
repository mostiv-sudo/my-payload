import type { Access } from 'payload'
import { checkRole } from './checkRole'

const user: Access = ({ req: { user } }) => {
  if (!user) return false

  if (checkRole(['admin', 'editor'], user)) {
    return true
  }

  return {
    id: { equals: user.id },
  }
}

export default user
