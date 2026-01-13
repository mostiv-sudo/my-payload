import { useState, useEffect } from 'react'
import { Episode } from '@/lib/types'

export const useEpisodes = (animeId: string | number, searchParams: URLSearchParams) => {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const fetchEpisodes = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/episodes?where[anime][equals]=${animeId}&limit=1000`,
          { cache: 'no-store', signal: controller.signal },
        )
        const data = await res.json()
        const sorted: Episode[] = (data.docs || []).sort(
          (a: Episode, b: Episode) => a.episodeNumber - b.episodeNumber,
        )
        setEpisodes(sorted)

        if (sorted.length) {
          const episodeFromUrl = Number(searchParams.get('episode')) || sorted[0].episodeNumber
          setCurrentEpisode(sorted.find((ep) => ep.episodeNumber === episodeFromUrl) || sorted[0])
        }
      } catch (err) {
        if ((err as any).name !== 'AbortError') console.error('Failed to fetch episodes', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEpisodes()
    return () => controller.abort()
  }, [animeId, searchParams])

  return { episodes, loading, currentEpisode, setCurrentEpisode }
}
