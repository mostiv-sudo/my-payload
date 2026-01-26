'use client'

import { GenresList } from '@/components/GenresList'

import { MediaContent } from '@/components/MediaContent'
import { useState, Suspense } from 'react'

export default function HomeClient() {
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>()

  return (
    <div className="container lg:px-7 px-4 py-10 flex flex-col gap-20">
      <Suspense fallback={<div />}>
        <MediaContent title="📺 Сейчас идет" filters={{ status: 'airing' }} sort="year_desc" />
      </Suspense>

      <Suspense fallback={<div />}>
        <MediaContent title="🆕 Новые релизы" sort="year_desc" filters={{ status: 'completed' }} />
      </Suspense>

      <Suspense fallback={<div />}>
        <GenresList />
      </Suspense>

      <Suspense fallback={<div />}>
        <MediaContent title="🔥 Популярное аниме" />
      </Suspense>
    </div>
  )
}
