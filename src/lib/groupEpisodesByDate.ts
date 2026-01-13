// export function groupEpisodesByDate(episodes: any[]) {
//   return episodes.reduce<Record<string, any[]>>((acc, ep) => {
//     if (!ep.released) return acc

//     const day = new Date(ep.released).toISOString().split('T')[0]
//     if (!acc[day]) acc[day] = []
//     acc[day].push(ep)

//     return acc
//   }, {})
// }

import { Episode } from './types'

export function groupEpisodesByDate(episodes: Episode[]) {
  return episodes.reduce<Record<string, Episode[]>>((acc, ep) => {
    const date = ep.released.slice(0, 10)
    acc[date] ??= []
    acc[date].push(ep)
    return acc
  }, {})
}
