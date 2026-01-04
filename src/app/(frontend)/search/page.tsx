'use client'

import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Search } from 'lucide-react'
import { MediaGrid } from '@/components/MediaGrid'

import { useSearchManager } from '@/hooks/useSearchManager'

export default function SearchPage() {
  const { q, setQ, items, hasMore, loading, initialLoading, loadMore } = useSearchManager()
  const LIMIT = 12

  return (
    <div className="lg:mx-auto mx-3 container pt-12 pb-5">
      <Card className="min-h-[80vh] border-none">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Search className="w-5 h-5" />
            Поиск
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 p-0">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Naruto, One Piece..."
            className="text-lg h-12"
          />

          {/* FIRST LOAD */}
          {initialLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
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
              <MediaGrid
                items={items as any}
                showRating
                limit={LIMIT}
                cols={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
              />

              {hasMore && (
                <div className="flex justify-center mt-8">
                  <Button onClick={loadMore} disabled={loading}>
                    {loading ? 'Загрузка…' : 'Показать ещё'}
                  </Button>
                </div>
              )}

              {loading && !initialLoading && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 mt-6">
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
