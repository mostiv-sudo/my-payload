// app/film/FilmPageClient.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function FilmPageClient() {
  const searchParams = useSearchParams()
  const [page, setPage] = useState<number>(1)

  useEffect(() => {
    const p = Number(searchParams.get('page') || 1)
    setPage(p)
  }, [searchParams])

  return <div>Текущая страница: {page}</div>
}
