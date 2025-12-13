'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

type SearchDoc = {
  id: string
  searchTitle: string
  slug: string
}

export default function SearchPage() {
  const [q, setQ] = useState('')
  const [results, setResults] = useState<SearchDoc[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // ⬇️ Запрос только после 2 символов
    if (q.trim().length < 2) {
      setResults([])
      setLoading(false)
      return
    }

    const controller = new AbortController()

    const run = async () => {
      setLoading(true)

      try {
        const res = await fetch(`/api/search?where[searchTitle][like]=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        })

        const json = await res.json()
        setResults(json.docs)
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          setResults([])
        }
      } finally {
        setLoading(false)
      }
    }

    // ⬇️ debounce 600ms
    const t = setTimeout(run, 600)

    return () => {
      controller.abort()
      clearTimeout(t)
    }
  }, [q])

  return (
    <div className="container max-w-xl py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Поиск аниме</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Naruto, One Piece..."
            className="text-base"
          />

          {loading && (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          )}

          {!loading && results.length === 0 && q.trim().length >= 2 && (
            <p className="text-sm text-muted-foreground text-center">Ничего не найдено</p>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2">
              <Separator />

              <ul className="space-y-2">
                {results.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/anime/${item.slug}`}
                      className="block rounded-md px-3 py-2 transition hover:bg-muted"
                    >
                      {item.searchTitle}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
