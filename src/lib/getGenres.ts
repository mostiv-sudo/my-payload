// lib/getGenres.ts
export async function getGenres() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/genres?limit=100`, {
    cache: 'no-store',
  })

  if (!res.ok) throw new Error('Ошибка загрузки жанров')

  const data = await res.json()
  return data.docs
}
