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
import { seedExternal } from './endpoint/seed.external'
import { seedGenres } from './endpoint/seed.genres'
import { seedAddGenreAnime } from './endpoint/seed.addGenres'
import { Episodes } from './collections/Episodes'
import { seedEpisodes } from './endpoint/seed.addEpisodes'

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
    if (process.env.SEED === 'external') {
      await seedExternal(payload)
    }
    if (process.env.SEED === 'genres') {
      await seedGenres(payload)
    }
    if (process.env.SEED === 'add-genres') {
      await seedAddGenreAnime(payload)
    }
    if (process.env.SEED === 'add-episode') {
      await seedEpisodes(payload)
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
  collections: [Users, Media, Anime, Genres, Studios, Episodes],
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
      // поля для поиска и индекса
      searchOverrides: {
        fields: ({ defaultFields }) => [
          ...defaultFields,
          {
            name: 'searchTitle',
            type: 'text',
            admin: { readOnly: true },
          },
          {
            name: 'slug',
            type: 'text',
            admin: { readOnly: true },
          },
          {
            name: 'type',
            type: 'text', // select нельзя, поэтому как text
            admin: { readOnly: true },
          },
          {
            name: 'year',
            type: 'number',
            admin: { readOnly: true },
          },
        ],
      },

      // перед сохранением в индекс
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
            type: originalDoc.type, // добавляем type
            year: originalDoc.year, // добавляем year
          }
        }

        return searchDoc
      },
    }),
  ],
})
