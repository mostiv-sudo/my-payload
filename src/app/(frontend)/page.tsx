'use client'
import { GenresList } from '@/components/GenresList'
import { MediaContent } from '@/components/MediaContent'
import { useState } from 'react'

export default function AnimePage() {
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>(undefined)
  return (
    <div className=" container lg:px-7 px-4 py-10 flex flex-col gap-20">
      {/* Онгоинги */}
      <MediaContent
        title="📺 Сейчас идет"
        filters={{ status: 'airing' }}
        sort="year_desc"
        showHero
        heroSlug="movie-gekijouban-chainsaw-man-reze-hen"
      />

      {/* 12+ + жанр school */}
      <MediaContent title="🆕 Новые релизы" sort="year_desc" filters={{ status: 'completed' }} />

      {/* Жанры */}
      <GenresList />

      {/* Популярное */}
      <MediaContent title="🔥 Популярное аниме" />
    </div>
  )
}
