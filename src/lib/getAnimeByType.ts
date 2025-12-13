// lib/getAnimeByType.ts
type Params = {
  type: 'movie' | 'series'
  page?: number
  limit?: number
}

export async function getAnimeByType({ type, page = 1, limit = 10 }: Params) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/anime` +
      `?where[type][equals]=${type}` +
      `&limit=${limit}` +
      `&page=${page}`,
    { cache: 'no-store' },
  )

  const data = await res.json()

  return {
    items: data.docs.map((item: any) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      poster: item.poster,
      type: item.type,
      year: item.year,
      rating: item.rating, // ⭐ ВАЖНО
    })),
    totalPages: data.totalPages,
    page: data.page,
  }
}
