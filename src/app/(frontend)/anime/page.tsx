import Link from 'next/link'
import { Button } from '@/components/ui/button'

type SearchParams = {
  sort?: string
}

async function getAnime(sort?: string) {
  const order = sort === 'rating_asc' ? 'rating' : '-rating'

  const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/anime?sort=${order}`, {
    cache: 'no-store',
  })

  const data = await res.json()
  return data.docs
}

export default async function AnimePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const currentSort = params.sort ?? 'rating_desc'

  const anime = await getAnime(currentSort)

  return (
    <div className="container mx-auto py-10 mt-20">
      {/* Фильтры */}
      <div className="flex gap-4 mb-6">
        <Link href="/anime?sort=rating_desc">
          <Button variant={currentSort === 'rating_desc' ? 'default' : 'outline'}>Рейтинг ↓</Button>
        </Link>

        <Link href="/anime?sort=rating_asc">
          <Button variant={currentSort === 'rating_asc' ? 'default' : 'outline'}>Рейтинг ↑</Button>
        </Link>
      </div>

      {/* Сетка */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {anime.map((item: any) => (
          <Link key={item.id} href={`/anime/${item.slug}`}>
            <div className="rounded-xl shadow hover:shadow-lg transition overflow-hidden">
              <img src={item.poster} alt={item.title} className="w-full h-64 object-cover" />
              <div className="p-3">
                <h3 className="font-semibold">{item.title}</h3>

                {item.rating && (
                  <p className="text-yellow-600 font-semibold text-sm">⭐ {item.rating}</p>
                )}

                <p className="text-sm text-gray-500">
                  {item.type === 'movie' ? 'Фильм' : 'Сериал'}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
