export function groupEpisodesByDate(episodes: any[]) {
  return episodes.reduce<Record<string, any[]>>((acc, ep) => {
    if (!ep.released) return acc

    const day = new Date(ep.released).toISOString().split('T')[0]
    if (!acc[day]) acc[day] = []
    acc[day].push(ep)

    return acc
  }, {})
}
