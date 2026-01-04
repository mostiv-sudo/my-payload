import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import Image from 'next/image'

import { Card } from '@/components/ui/card'
import { Star, Bookmark as BookmarkIcon, Eye } from 'lucide-react'
import { AccountAnimeCard } from '@/components/accaunt/AccountAnimeCard'

type Props = {
  params: { category: 'ratings' | 'bookmarks' }
  searchParams: { page?: string }
}

export default async function AccountCategoryPage(props: Props) {
  const params = await Promise.resolve(props.params)
  const searchParams = await Promise.resolve(props.searchParams)
  const category = params.category
  const page = Number(searchParams.page ?? 1)

  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user }: any = await payload.auth({ headers })

  if (!user) return null

  const config = {
    ratings: { collection: 'ratings', title: 'Ваши оценки' },
    bookmarks: { collection: 'bookmarks', title: 'Ваши закладки' },
  }[category]

  if (!config) return null

  const data = await payload.find({
    collection: config.collection as any,
    where: { user: { equals: user.id } },
    sort: '-createdAt',
    page,
    limit: 12,
    depth: 2, // важно: anime подтягивается целиком
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{config.title}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.docs.map((item: any) => (
          <AccountAnimeCard
            key={item.id}
            anime={item.anime}
            category={category}
            rating={item.rating}
            comment={item.comment}
            status={item.status}
            createdAt={item.createdAt}
          />
        ))}
      </div>
    </div>
  )
}
