'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SortType } from '@/lib/types'
import { useFilters } from './useFilters'

const SORT_OPTIONS: { value: SortType; label: string }[] = [
  { value: 'rating_desc', label: 'Рейтинг ↓' },
  { value: 'rating_asc', label: 'Рейтинг ↑' },
  { value: 'year_desc', label: 'Год ↓' },
  { value: 'year_asc', label: 'Год ↑' },
]

export function SortSelect({ basePath, value }: { basePath: string; value?: string }) {
  const { setParam } = useFilters(basePath)

  // Проверяем, что значение соответствует SortType
  const safeValue: SortType | undefined = SORT_OPTIONS.find((o) => o.value === value)?.value

  return (
    <Select value={safeValue} onValueChange={(v) => setParam('sort', v)}>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Сортировка" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
