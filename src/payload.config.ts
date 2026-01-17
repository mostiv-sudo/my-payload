// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// Коллекции
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Anime } from './collections/Anime'
import { Genres } from './collections/Genre'
import { Studios } from './collections/Studios'
import { Episodes } from './collections/Episodes'
import { Comments } from './collections/Comments'
import { Bookmarks } from './collections/Bookmarks'
import { Ratings } from './collections/Ratings'
import { EpisodeGenerator } from './collections/EpisodeGenerator'

// Языки
import { en } from './languages/en'
import { ru } from './languages/ru'

// Плагины
import { searchPlugin } from '@payloadcms/plugin-search'

// Jobs
import { runEpisodesSyncKodik } from './collections/Episodes/tasks/syncEpisodes.task'

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
    if (process.env.SEED === 'episodes') {
      await import('./endpoint').then(({ seed }) => seed(payload))
    }

    /**
     * 👉 Опционально: поставить первую job при старте
     */
    if (process.env.ENABLE_JOB_WORKERS === 'true') {
      await payload.jobs.queue({
        task: 'sync-episodes-from-kodik',
        queue: 'nightly',
        input: {}, // <- обязательно!
      })
    }
  },

  i18n: {
    fallbackLanguage: 'en',
    supportedLanguages: { en, ru },
    translations: { en, ru },
  },

  collections: [
    Users,
    Media,
    Anime,
    Genres,
    Studios,
    Episodes,
    Comments,
    Bookmarks,
    Ratings,
    EpisodeGenerator,
  ],

  /* ===========================
     JOBS + CRON
  =========================== */
  jobs: {
    tasks: [
      {
        slug: 'sync-episodes-from-kodik', // <- используем допустимое имя
        handler: async ({ req }) => {
          // Запускаем синхронизацию
          const result = await runEpisodesSyncKodik(req)

          // Возвращаем результат в формате TaskHandlerResult
          return {
            output: result, // сюда можно вернуть объект с { ok, updated, skipped, notFound, ... }
          }
        },
      },
    ],

    autoRun: [
      {
        cron: '0 */2 * * *', // каждые 2 часа
        queue: 'nightly',
        limit: 50,
      },
    ],

    shouldAutoRun: async () => process.env.ENABLE_JOB_WORKERS === 'true',

    processingOrder: {
      queues: {
        nightly: 'createdAt',
      },
    },
  },

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
      searchOverrides: {
        fields: ({ defaultFields }) => [
          ...defaultFields,
          { name: 'searchTitle', type: 'text', admin: { readOnly: true } },
          { name: 'slug', type: 'text', admin: { readOnly: true } },
          { name: 'type', type: 'text', admin: { readOnly: true } },
          { name: 'year', type: 'number', admin: { readOnly: true } },
        ],
      },
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
            type: originalDoc.type,
            year: originalDoc.year,
          }
        }

        return searchDoc
      },
    }),
  ],
})
