import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { episodesSyncKodik } from './hooks/episodesSyncKodik'

export const Episodes: CollectionConfig = {
  slug: 'episodes',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'anime', 'season', 'episodeNumber', 'released'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    { name: 'anime', type: 'relationship', relationTo: 'anime', required: true },
    { name: 'season', type: 'number', required: true, defaultValue: 1 },
    { name: 'episodeNumber', type: 'number', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'released', type: 'date' },
    { name: 'duration', type: 'number' },
    { name: 'videoLink', type: 'text' },
    slugField({ fieldToUse: 'title' }),
  ],
  endpoints: [
    {
      path: '/episodes-sync-kodik',
      method: 'get',
      handler: episodesSyncKodik,
    },
  ],
}
