'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Navigation } from 'swiper/modules'
import { useSearchParams, useRouter } from 'next/navigation'
import { Play, Layers } from 'lucide-react'

type Episode = {
  id: string
  title: string
  episodeNumber: number
  season: number
  videoLink?: string
}

type Props = { animeId: string | number }

export const EpisodesSlider: React.FC<Props> = ({ animeId }) => {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSeason, setCurrentSeason] = useState<number | null>(null)
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null)
  const [videoLoading, setVideoLoading] = useState(true)

  const searchParams = useSearchParams()
  const router = useRouter()

  const seasons = useMemo(() => {
    const map: Record<number, Episode[]> = {}
    episodes.forEach((ep) => {
      if (!map[ep.season]) map[ep.season] = []
      map[ep.season].push(ep)
    })
    return map
  }, [episodes])

  // --- Загружаем эпизоды один раз ---
  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/episodes?where[anime][equals]=${animeId}&limit=1000`,
          { cache: 'no-store' },
        )
        const data = await res.json()
        const sorted = (data.docs || []).sort((a: Episode, b: Episode) =>
          a.season !== b.season ? a.season - b.season : a.episodeNumber - b.episodeNumber,
        )
        setEpisodes(sorted)

        const season = Number(searchParams.get('season')) || sorted[0]?.season
        const episodeNum = Number(searchParams.get('episode')) || sorted[0]?.episodeNumber
        setCurrentSeason(season)
        setCurrentEpisode(
          sorted.find((ep: Episode) => ep.season === season && ep.episodeNumber === episodeNum) ||
            sorted[0],
        )
      } catch (err) {
        console.error('Failed to fetch episodes', err)
      } finally {
        setLoading(false)
      }
    }
    fetchEpisodes()
  }, [animeId])

  // --- Обновляем только эпизод в URL ---
  const handleEpisodeChange = (ep: Episode) => {
    setVideoLoading(true)
    setCurrentEpisode(ep)
    const params = new URLSearchParams(searchParams.toString())
    params.set('season', String(ep.season))
    params.set('episode', String(ep.episodeNumber))
    router.replace(`?${params}`, { scroll: false })
  }

  if (loading)
    return (
      <div className="animate-pulse space-y-4 mt-8">
        <div className="h-6 w-40 bg-muted rounded" />
        <div className="h-40 bg-muted rounded-2xl" />
      </div>
    )

  if (!episodes.length) return <p className="mt-8 text-muted-foreground">Эпизоды отсутствуют.</p>

  return (
    <section className="mt-12 space-y-6">
      {/* VIDEO */}
      {currentEpisode?.videoLink && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            Сезон {currentEpisode.season}, Эпизод {currentEpisode.episodeNumber}
          </h3>

          <div className="relative aspect-video rounded-2xl overflow-hidden border border-border/60 shadow-lg">
            {videoLoading && (
              <div className="absolute inset-0 bg-muted/30 animate-pulse flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Загрузка видео...</span>
              </div>
            )}
            <iframe
              key={currentEpisode.id} // ключ для плавного обновления
              src={currentEpisode.videoLink}
              title={`Эпизод ${currentEpisode.episodeNumber}`}
              allowFullScreen
              className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
                videoLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setVideoLoading(false)}
            />
          </div>
        </div>
      )}

      {/* SLIDER НАВИГАЦИИ ПО СЕРИЯМ ВНИЗУ */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Layers size={22} className="text-primary" />
          <h2 className="text-2xl font-bold">Эпизоды</h2>
        </div>

        {/* Селектор сезона */}
        <div className="flex gap-2 flex-wrap mb-4">
          {Object.keys(seasons).map((s) => {
            const seasonNum = Number(s)
            const isActive = seasonNum === currentSeason
            return (
              <button
                key={s}
                onClick={() => {
                  setCurrentSeason(seasonNum)
                  handleEpisodeChange(seasons[seasonNum][0])
                }}
                className={`px-4 py-1 rounded-full border transition ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background/60 border-border hover:bg-primary hover:text-primary-foreground'
                }`}
              >
                Сезон {s}
              </button>
            )
          })}
        </div>

        {/* SLIDER */}
        {currentSeason && seasons[currentSeason] && (
          <Swiper
            modules={[Navigation]}
            navigation={{ prevEl: '.ep-prev', nextEl: '.ep-next' }}
            spaceBetween={14}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 6 },
            }}
          >
            {seasons[currentSeason].map((ep) => {
              const isActive = currentEpisode?.id === ep.id
              return (
                <SwiperSlide key={ep.id} className="p-1">
                  <div
                    onClick={() => handleEpisodeChange(ep)}
                    className={`flex flex-col items-center h-full cursor-pointer rounded-xl border p-4 transition-all ${
                      isActive
                        ? 'border-primary bg-primary/10 shadow-md scale-[1.02]'
                        : 'border-border/60 bg-background/60 hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="text-sm font-semibold">Эпизод {ep.episodeNumber}</div>
                    <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {ep.title}
                    </div>
                    {ep.videoLink && (
                      <div
                        className={`mt-4 flex items-center justify-center gap-2 text-xs font-medium ${
                          isActive
                            ? 'text-primary'
                            : 'text-muted-foreground group-hover:text-primary'
                        }`}
                      >
                        <Play size={16} /> Смотреть
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
        )}
      </div>
    </section>
  )
}
