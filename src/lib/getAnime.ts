// lib/getAnime.ts
type Params = {
  sort?: 'rating_desc' | 'rating_asc'
  page?: number
  limit?: number
}

export async function getAnime({ sort = 'rating_desc', page = 1, limit = 24 }: Params) {
  const order = sort === 'rating_asc' ? 'rating' : '-rating'

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/anime` +
      `?sort=${order}` +
      `&page=${page}` +
      `&limit=${limit}`,
    { cache: 'no-store' },
  )

  const data = await res.json()

  return {
    items: data.docs,
    totalPages: data.totalPages,
    page: data.page,
  }
}
