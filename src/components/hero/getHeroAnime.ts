import { Anime } from '@/lib/types'

let heroCache: Anime | null = null
let cacheTime = 0

export async function getHeroAnime(): Promise<Anime | null> {
  if (Date.now() - cacheTime < 60_000 && heroCache) {
    return heroCache
  }

  const url = new URL('/api/anime', process.env.NEXT_PUBLIC_PAYLOAD_URL)
  url.searchParams.set('sort', '-rating')
  url.searchParams.set('limit', '1')
  url.searchParams.set('depth', '1')

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      console.error('getHeroAnime: ошибка запроса', await res.text())
      return null
    }

    const data = await res.json()

    if (!data || !Array.isArray(data.docs)) {
      console.warn('getHeroAnime: некорректный формат ответа', data)
      return null
    }

    heroCache = data.docs[0] ?? null
    cacheTime = Date.now()
    return heroCache
  } catch (err) {
    console.error('getHeroAnime: не удалось загрузить Hero anime', {
      url: url.toString(),
      error: err,
    })
    return null
  }
}
