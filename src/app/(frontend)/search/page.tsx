import { Suspense } from 'react'
import SearchClient from './SearchClient'

type SearchParams = {
  q?: string
  page?: string
}

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams

  const initialQ = params.q ?? ''
  const initialPage = Number(params.page ?? 1)

  return (
    <Suspense fallback={<div>Загрузка…</div>}>
      <SearchClient initialQ={initialQ} initialPage={initialPage} />
    </Suspense>
  )
}
