import type { Access } from 'payload'
import { checkRole } from './checkRole'

export const adminOnly: Access = ({ req }) => checkRole(['admin'], req.user)
