export async function getEpisodesCalendar(from: string, to: string) {
  if (!process.env.NEXT_PUBLIC_PAYLOAD_URL) {
    throw new Error('NEXT_PUBLIC_PAYLOAD_URL не задан')
  }

  if (from > to) return []

  const params = new URLSearchParams({
    'where[released][greater_than_equal]': from,
    'where[released][less_than_equal]': to,
    sort: 'released',
    limit: '200',
    depth: '1',

    'select[id]': 'true',
    'select[released]': 'true',
    'select[episodeNumber]': 'true',

    'select[anime][slug]': 'true',
    'select[anime][title]': 'true',
    'select[anime][poster_url]': 'true',
    'select[anime][rating]': 'true',
    'select[anime][minimal_age]': 'true',
    'select[anime][status]': 'true',
  })

  const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/episodes?${params}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    console.error(await res.text())
    throw new Error('Ошибка загрузки календаря эпизодов')
  }

  const { docs } = await res.json()
  return docs ?? []
}
