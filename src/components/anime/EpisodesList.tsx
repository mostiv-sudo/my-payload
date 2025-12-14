'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

type Episode = {
  id: string
  title: string
  episodeNumber: number
  season: number
  videoLink?: string
}

type Props = {
  animeId: string | number
}

export const EpisodesList: React.FC<Props> = ({ animeId }) => {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEpisodes() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/episodes?where[anime][equals]=${animeId}&limit=1000`,
          { cache: 'no-store' },
        )
        const data = await res.json()
        setEpisodes(data.docs || [])
      } catch (err) {
        console.error('Ошибка загрузки эпизодов:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEpisodes()
  }, [animeId])

  if (loading) return <p>Загрузка эпизодов...</p>
  if (!episodes.length) return <p>Эпизоды отсутствуют.</p>

  // Группируем по сезонам
  const seasons: Record<number, Episode[]> = {}
  episodes.forEach((ep) => {
    if (!seasons[ep.season]) seasons[ep.season] = []
    seasons[ep.season].push(ep)
  })

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">Эпизоды</h2>
      {Object.keys(seasons)
        .sort((a, b) => Number(a) - Number(b)) // сортировка по номеру сезона
        .map((seasonNum) => (
          <div key={seasonNum} className="mb-6">
            <h3 className="text-xl font-medium mb-2">Сезон {seasonNum}</h3>
            <ul className="flex flex-wrap gap-2">
              {seasons[Number(seasonNum)]
                .sort((a, b) => a.episodeNumber - b.episodeNumber) // сортировка по номеру эпизода
                .map((ep) => (
                  <li key={ep.id}>
                    <Link
                      href={ep.videoLink || '#'}
                      target="_blank"
                      className="px-3 py-1 border rounded hover:bg-primary hover:text-primary-foreground transition"
                    >
                      Эпизод {ep.episodeNumber}: {ep.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
    </div>
  )
}
