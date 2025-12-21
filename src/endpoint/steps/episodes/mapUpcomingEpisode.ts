type UpcomingJson = {
  next_episode: number
  next_episode_at: string
  duration?: number
  anime: {
    id: string
    name: string
  }
}

export function mapUpcomingEpisode(item: UpcomingJson) {
  if (!item?.next_episode || !item?.next_episode_at) return null

  return {
    season: 1,
    episodeNumber: item.next_episode,
    title: `${item.anime.name} — Episode ${item.next_episode}`,
    description: 'Эпизод скоро выйдет',
    released: item.next_episode_at,
    duration: item.duration ?? null,
    videoLink: null,
  }
}
