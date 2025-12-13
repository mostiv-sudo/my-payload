// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'

import { en } from './languages/en'
import { ru } from './languages/ru'
import { Anime } from './collections/Anime'
import { Genres } from './collections/Genre'
import { Studios } from './collections/Studios'
import { seed } from './endpoint/import-anime'
import { searchPlugin } from '@payloadcms/plugin-search'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  onInit: async (payload) => {
    if (process.env.SEED === 'true') {
      await seed(payload)
    }
  },

  i18n: {
    fallbackLanguage: 'en',

    supportedLanguages: {
      en,
      ru,
    },

    translations: {
      en,
      ru,
    },
  },
  collections: [Users, Media, Anime, Genres, Studios],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    searchPlugin({
      collections: ['anime'],

      // ✅ ТОЛЬКО поля
      searchOverrides: {
        fields: ({ defaultFields }) => [
          ...defaultFields,
          {
            name: 'searchTitle',
            type: 'text',
            admin: {
              readOnly: true,
            },
          },
          {
            name: 'slug',
            type: 'text',
            admin: { readOnly: true },
          },
        ],
      },

      // ✅ beforeSync ВОТ ЗДЕСЬ
      beforeSync: ({ originalDoc, searchDoc }) => {
        if (searchDoc.doc.relationTo === 'anime') {
          const normalize = (str = '') =>
            str
              .toLowerCase()
              .replace(/[^a-z0-9а-яё\s]/gi, '')
              .trim()

          return {
            ...searchDoc,
            searchTitle: [
              originalDoc.title,
              originalDoc.title_en,
              normalize(originalDoc.title),
              normalize(originalDoc.title_en),
            ]
              .filter(Boolean)
              .join(' '),
            slug: originalDoc.slug,
          }
        }

        return searchDoc
      },
    }),
  ],
})
