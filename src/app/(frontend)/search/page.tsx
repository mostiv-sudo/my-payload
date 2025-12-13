'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { MediaGrid, type MediaItem } from '@/components/MediaGrid'

type SearchDoc = {
  id: string
  slug: string
  searchTitle: string
  poster?: string
  type?: 'movie' | 'series'
  year?: number
}

const LIMIT = 12

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // 🔹 init from URL
  const initialQ = searchParams.get('q') ?? ''
  const initialPage = Number(searchParams.get('page') ?? 1)

  const [q, setQ] = useState(initialQ)
  const [items, setItems] = useState<MediaItem[]>([])
  const [page, setPage] = useState(initialPage)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(false)

  const updateUrl = (next: { q?: string; page?: number }) => {
    const params = new URLSearchParams(searchParams.toString())

    if (next.q !== undefined) {
      next.q ? params.set('q', next.q) : params.delete('q')
      params.set('page', '1')
    }

    if (next.page !== undefined) {
      params.set('page', String(next.page))
    }

    router.replace(`?${params.toString()}`, { scroll: false })
  }

  const fetchData = async (pageToLoad = 1, replace = false) => {
    if (!q.trim()) return

    pageToLoad === 1 ? setInitialLoading(true) : setLoading(true)

    try {
      const res = await fetch(
        `/api/search?where[searchTitle][like]=${encodeURIComponent(q)}&page=${pageToLoad}&limit=${LIMIT}`,
      )

      const json = await res.json()

      const mapped: MediaItem[] = json.docs.map((item: SearchDoc) => ({
        id: item.id,
        slug: item.slug,
        title: item.searchTitle,
        poster: item.poster,
        type: item.type,
        year: item.year,
      }))

      setItems((prev) => (replace ? mapped : [...prev, ...mapped]))
      setHasMore(json.hasNextPage)
      setPage(pageToLoad)
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }

  // 🔍 URL → DATA (при первом рендере и Back/Forward)
  useEffect(() => {
    if (q.trim().length < 2) {
      setItems([])
      return
    }

    fetchData(page, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 🔍 INPUT → URL → DATA
  useEffect(() => {
    if (q.trim().length < 2) {
      updateUrl({ q: '' })
      setItems([])
      return
    }

    const t = setTimeout(() => {
      updateUrl({ q })
      fetchData(1, true)
    }, 600)

    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  return (
    <div className="lg:mx-auto mx-3 max-w-7xl  pt-12 pb-5">
      <Card className="min-h-[80vh]">
        <CardHeader>
          <CardTitle className="text-2xl">Поиск</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Naruto, One Piece..."
            className="text-lg h-12"
          />

          {/* FIRST LOAD */}
          {initialLoading && (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
              {Array.from({ length: LIMIT }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-64 rounded-2xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* EMPTY */}
          {!initialLoading && items.length === 0 && q.trim().length >= 2 && (
            <>
              <Separator />
              <p className="text-sm text-muted-foreground text-center">Ничего не найдено</p>
            </>
          )}

          {/* RESULTS */}
          {items.length > 0 && (
            <>
              <Separator />
              <MediaGrid items={items} showRating />

              {hasMore && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={() => {
                      const nextPage = page + 1
                      updateUrl({ page: nextPage })
                      fetchData(nextPage)
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Загрузка…' : 'Показать ещё'}
                  </Button>
                </div>
              )}

              {loading && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-64 rounded-2xl" />
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
