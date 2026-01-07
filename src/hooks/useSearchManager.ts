'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { mapSearchDocs, type SearchDoc } from '@/lib/mapSearchDocs'
import { MediaItem } from '@/lib/types'

const LIMIT = 12
const MIN_QUERY_LENGTH = 2
const DEBOUNCE_DELAY = 600

type UseSearchManagerProps = {
  initialQ: string
  initialPage: number
}

export function useSearchManager({ initialQ, initialPage }: UseSearchManagerProps) {
  const router = useRouter()

  const [q, setQ] = useState(initialQ)
  const [items, setItems] = useState<MediaItem[]>([])
  const [page, setPage] = useState(initialPage)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(false)

  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // ---- Update URL ----
  const updateUrl = useCallback(
    (next: { q?: string; page?: number }) => {
      const params = new URLSearchParams(window.location.search)

      if (next.q !== undefined) {
        next.q ? params.set('q', next.q) : params.delete('q')
        params.set('page', '1')
      }

      if (next.page !== undefined) {
        params.set('page', String(next.page))
      }

      router.replace(`?${params.toString()}`, { scroll: false })
    },
    [router],
  )

  // ---- Fetch Data ----
  const fetchData = useCallback(async (query: string, pageToLoad = 1, replace = false) => {
    if (query.trim().length < MIN_QUERY_LENGTH) return

    pageToLoad === 1 ? setInitialLoading(true) : setLoading(true)

    try {
      const res = await fetch(
        `/api/search?where[searchTitle][like]=${encodeURIComponent(
          query,
        )}&page=${pageToLoad}&limit=${LIMIT}`,
      )
      const json = await res.json()

      const mapped: MediaItem[] = mapSearchDocs(json.docs as SearchDoc[]).map((item) => ({
        ...item,
        description: item.description ?? '',
      }))

      setItems((prev) => (replace ? mapped : [...prev, ...mapped]))
      setHasMore(json.hasNextPage)
      setPage(pageToLoad)
    } catch (err) {
      console.error('Failed to fetch search data', err)
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }, [])

  // ---- Initial load ----
  useEffect(() => {
    if (q.trim().length >= MIN_QUERY_LENGTH) {
      fetchData(q, initialPage, true)
    } else {
      setItems([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- Input → URL → DATA (Debounce) ----
  useEffect(() => {
    if (q.trim().length < MIN_QUERY_LENGTH) {
      updateUrl({ q: '' })
      setItems([])
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      updateUrl({ q })
      fetchData(q, 1, true)
    }, DEBOUNCE_DELAY)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [q, fetchData, updateUrl])

  // ---- Load more ----
  const loadMore = () => {
    const nextPage = page + 1
    updateUrl({ page: nextPage })
    fetchData(q, nextPage)
  }

  return {
    q,
    setQ,
    items,
    hasMore,
    loading,
    initialLoading,
    loadMore,
  }
}
