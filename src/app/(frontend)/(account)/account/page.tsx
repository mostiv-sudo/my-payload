import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ArrowLeft, LogOut, Star, Bookmark as BookmarkIcon } from 'lucide-react'
import { AccountSection } from '@/components/accaunt/AccountSection'
import { AccountAnimeCard } from '@/components/accaunt/AccountAnimeCard'

const PREVIEW_LIMIT = 6

export default async function AccountPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user }: any = await payload.auth({ headers })

  if (!user) return null

  const [bookmarks, ratings] = await Promise.all([
    payload.find({
      collection: 'bookmarks',
      where: { user: { equals: user.id } },
      sort: '-createdAt',
      depth: 2,
      limit: PREVIEW_LIMIT,
    }),
    payload.find({
      collection: 'ratings',
      where: { user: { equals: user.id } },
      sort: '-createdAt',
      depth: 2,
      limit: PREVIEW_LIMIT,
    }),
  ])

  return (
    <div className="container mx-auto px-4 py-10 space-y-10">
      {/* RATINGS */}
      <AccountSection
        title="Ваши оценки"
        icon={<Star size={20} />}
        count={ratings.totalDocs}
        emptyText="Вы ещё не оценивали аниме."
        viewAllHref="/account/ratings"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ratings.docs.map((r: any) => (
            <AccountAnimeCard
              key={r.id}
              anime={r.anime}
              category="ratings"
              rating={r.rating}
              comment={r.comment}
              createdAt={r.createdAt}
            />
          ))}
        </div>
      </AccountSection>

      {/* BOOKMARKS */}
      <AccountSection
        title="Ваши закладки"
        icon={<BookmarkIcon size={20} />}
        count={bookmarks.totalDocs}
        emptyText="Вы ещё не добавляли аниме в закладки."
        viewAllHref="/account/bookmarks"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarks.docs.map((b: any) => (
            <AccountAnimeCard
              key={b.id}
              anime={b.anime}
              category="bookmarks"
              status={b.status}
              createdAt={b.createdAt}
            />
          ))}
        </div>
      </AccountSection>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between pt-4">
        <Button variant="outline" asChild className="gap-2">
          <Link href="/">
            <ArrowLeft size={16} />
            На главную
          </Link>
        </Button>

        <Button variant="destructive" asChild className="gap-2">
          <Link href="/logout">
            <LogOut size={16} />
            Выйти
          </Link>
        </Button>
      </div>
    </div>
  )
}
