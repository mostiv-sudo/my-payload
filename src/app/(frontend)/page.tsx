import { AnimeGridSkeleton } from '@/components/anime/AnimeGridSkeleton'
import { AnimeSwiper } from '@/components/anime/AnimeSwiper'
import { HeroAnime } from '@/components/HeroAnime'

async function getAnime() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/anime?limit=20&sort=rating_desc`,
    { cache: 'no-store' },
  )
  const data = await res.json()
  return data.docs
}

export default async function AnimePage() {
  const anime = await getAnime()

  const hero = anime[0]
  const popular = anime.slice(1, 12)
  const fresh = anime.slice(12, 40)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 ">
      {/* HERO */}
      {hero ? <HeroAnime anime={hero} /> : <AnimeGridSkeleton count={1} />}

      {/* POPULAR */}
      <section className="mb-16">
        <h2 className="mb-6 text-3xl font-bold">🔥 Популярное</h2>
        <AnimeSwiper items={popular} />
      </section>

      {/* NEW */}
      <section>
        <h2 className="mb-6 text-3xl font-bold">🆕 Новые</h2>
        <AnimeSwiper items={fresh} />
      </section>
    </div>
  )
}
