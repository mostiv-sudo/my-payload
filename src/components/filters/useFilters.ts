'use client'

import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function useFilters(basePath: string) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // -----------------------------
  // Параметры из URL
  // -----------------------------
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

  // -----------------------------
  // Установить один параметр
  // -----------------------------
  const setParam = (key: string, value?: string | string[]) => {
    const search = new URLSearchParams(searchParams.toString())

    if (value === undefined || (Array.isArray(value) && value.length === 0)) {
      search.delete(key)
    } else {
      search.set(key, Array.isArray(value) ? value.join(',') : value)
    }

    // Сбрасываем page на 1, если изменился любой фильтр кроме page
    if (key !== 'page') {
      search.set('page', '1')
    }

    router.replace(`${pathname}?${search.toString()}`)
  }

  // -----------------------------
  // Сбросить все фильтры
  // -----------------------------
  const resetParams = () => {
    router.replace(basePath)
  }

  return { params, setParam, resetParams }
}
