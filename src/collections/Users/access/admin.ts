import type { Access } from 'payload'
import { checkRole } from './checkRole'

const admin: Access = ({ req: { user } }) => checkRole(['admin'], user)

export default admin
