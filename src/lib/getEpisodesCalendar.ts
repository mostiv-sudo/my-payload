// lib/getEpisodesCalendar.ts
export async function getEpisodesCalendar(from: string, to: string) {
  const params = new URLSearchParams({
    'where[released][greater_than_equal]': from,
    'where[released][less_than_equal]': to,
    sort: 'released',
    depth: '2',
  })

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/episodes?${params.toString()}`,
    { cache: 'no-store' },
  )

  if (!res.ok) {
    throw new Error('Ошибка загрузки календаря эпизодов')
  }

  const data = await res.json()
  return data.docs ?? []
}
