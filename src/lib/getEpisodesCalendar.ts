// lib/getEpisodesCalendar.ts

export async function getEpisodesCalendar(from: string, to: string) {
  const params = new URLSearchParams({
    // фильтр по дате
    'where[released][greater_than_equal]': from,
    'where[released][less_than_equal]': to,

    // сортировка
    sort: 'released',

    // pagination (чтобы не словить 500)
    limit: '200',

    // тянем только нужную глубину
    depth: '1',

    // выборка полей эпизода
    'select[id]': 'true',
    'select[released]': 'true',
    'select[episodeNumber]': 'true',
    'select[season]': 'true',

    // выборка полей аниме
    'select[anime][slug]': 'true',
    'select[anime][title]': 'true',
    'select[anime][poster]': 'true',
    'select[anime][rating]': 'true',
    'select[anime][minimal_age]': 'true',
    'select[anime][status]': 'true',
  })

  const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/episodes?${params}`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    console.error(await res.text())
    throw new Error('Ошибка загрузки календаря эпизодов')
  }

  const { docs } = await res.json()
  return docs ?? []
}
