'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

type Genre = {
  id: number
  slug: string
  title: string
}

// -----------------------------
// Хук для работы с фильтрами через URL (SSR safe)
// -----------------------------
function useFilters(basePath: string) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const params = useMemo(() => {
    const obj: Record<string, string | string[]> = {}
    searchParams.forEach((value, key) => {
      if (obj[key]) {
        if (Array.isArray(obj[key])) {
          ;(obj[key] as string[]).push(value)
        } else {
          obj[key] = [obj[key] as string, value]
        }
      } else {
        obj[key] = value
      }
    })
    return obj
  }, [searchParams])

  const setParam = (key: string, value?: string | string[]) => {
    const search = new URLSearchParams(searchParams.toString())

    if (value === undefined || (Array.isArray(value) && value.length === 0)) {
      search.delete(key)
    } else {
      search.set(key, Array.isArray(value) ? value.join(',') : value)
    }

    // Сбрасываем страницу на 1 при изменении любого фильтра кроме page
    if (key !== 'page') {
      search.set('page', '1')
    }

    router.replace(`${pathname}?${search.toString()}`)
  }

  const resetParams = () => {
    router.replace(basePath)
  }

  return { params, setParam, resetParams }
}

// -----------------------------
// FilterSidebar
// -----------------------------
export function FilterSidebar({ basePath, type }: { basePath: string; type?: 'movie' | 'series' }) {
  const { params, setParam, resetParams } = useFilters(basePath)

  const selectedGenres: string[] = useMemo(() => {
    const g = params['genre']
    return Array.isArray(g) ? g : g ? g.split(',') : []
  }, [params])

  const status = (params['status'] as string) ?? ''
  const age = (params['age'] as string) ?? ''

  const [genres, setGenres] = useState<Genre[]>([])
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // -----------------------------
  // Загружаем все жанры
  // -----------------------------
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/genres?limit=1000`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setGenres(d.docs))
      .catch(console.error)
  }, [])

  // -----------------------------
  // Закрытие дропдауна по клику вне
  // -----------------------------
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggleGenre = (slug: string) => {
    const next = selectedGenres.includes(slug)
      ? selectedGenres.filter((g) => g !== slug)
      : [...selectedGenres, slug]
    setQuery('')
    setIsOpen(false)
    setParam('genre', next.length ? next : undefined)
  }

  const suggestions = useMemo(
    () =>
      genres.filter(
        (g) =>
          !selectedGenres.includes(g.slug) && g.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [genres, selectedGenres, query],
  )

  return (
    <aside
      ref={ref}
      className="w-full md:w-72 flex-shrink-0 p-6 rounded-2xl border border-border/60 bg-background/70 backdrop-blur shadow-sm sticky top-24 space-y-6 "
    >
      <h3 className="text-lg font-semibold flex justify-between items-center">
        Фильтры
        <button
          onClick={resetParams}
          className="text-sm text-red-500 hover:underline"
          type="button"
        >
          Сбросить
        </button>
      </h3>

      {/* Жанры */}
      <div className="relative">
        <label className="text-sm font-medium text-muted-foreground mb-1 block">Жанры</label>
        <div
          className="flex flex-wrap gap-1 px-2 py-2 rounded-lg border bg-background cursor-text"
          onClick={() => setIsOpen(true)}
        >
          {selectedGenres.map((slug) => {
            const genre = genres.find((g) => g.slug === slug)
            if (!genre) return null
            return (
              <span
                key={slug}
                className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-primary text-primary-foreground"
              >
                {genre.title}
                <button
                  onClick={() => toggleGenre(slug)}
                  className="font-bold hover:opacity-80"
                  type="button"
                >
                  ×
                </button>
              </span>
            )
          })}

          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
            }}
            placeholder="Добавить жанр..."
            className="flex-1 border-none bg-transparent focus:ring-0"
          />
        </div>

        <div
          className={cn(
            'absolute z-10 top-full mt-1 w-full rounded-lg border bg-background shadow transition',
            isOpen && suggestions.length
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95 pointer-events-none',
          )}
        >
          <ScrollArea className="max-h-56">
            {suggestions.map((g) => (
              <div
                key={g.id}
                onClick={() => toggleGenre(g.slug)}
                className="px-4 py-2 cursor-pointer hover:bg-muted"
              >
                {g.title}
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>

      {/* Статус */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Статус</label>
        <Select value={status} onValueChange={(v) => setParam('status', v || undefined)}>
          <SelectTrigger>
            <SelectValue placeholder="Любой" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="announced">Анонс</SelectItem>
            {type !== 'movie' && <SelectItem value="airing">В эфире</SelectItem>}
            <SelectItem value="completed">Завершено</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Возраст */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Возраст</label>
        <Select value={age} onValueChange={(v) => setParam('age', v || undefined)}>
          <SelectTrigger>
            <SelectValue placeholder="Любой" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">0+</SelectItem>
            <SelectItem value="6">6+</SelectItem>
            <SelectItem value="12">12+</SelectItem>
            <SelectItem value="16">16+</SelectItem>
            <SelectItem value="18">18+</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </aside>
  )
}
