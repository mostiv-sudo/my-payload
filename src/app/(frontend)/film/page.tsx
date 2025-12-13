import Link from 'next/link'

async function getMovies() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/anime?where[type][equals]=movie`,
    { cache: 'no-store' },
  )
  const data = await res.json()
  return data.docs
}

export default async function MoviesPage() {
  const movies = await getMovies()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Фильмы</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {movies.map((item: any) => (
          <Link key={item.id} href={`/anime/${item.slug}`}>
            <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
              <img src={item.poster} alt={item.title} className="w-full h-64 object-cover" />
              <div className="p-3">
                <h3 className="font-semibold text-amber-500">{item.title}</h3>
                <p className="text-sm text-gray-500">Фильм</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
