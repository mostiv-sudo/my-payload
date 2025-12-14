'use client'

import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import { useSearchParams, useRouter } from 'next/navigation'
import { Play, Layers, ChevronLeft, ChevronRight } from 'lucide-react'

SwiperCore.use([Navigation])

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

/* 🔹 Кастомные стрелки */
function SliderNav({ prev, next }: { prev: string; next: string }) {
  return (
    <>
      <button
        className={`
          ${prev}
          absolute left-2 top-1/2 -translate-y-1/2 z-10
          h-10 w-10 rounded-full
          border border-border/60
          bg-background/80 backdrop-blur
          flex items-center justify-center
          shadow-sm hover:shadow-md
          hover:bg-primary hover:text-primary-foreground
          transition
        `}
      >
        <ChevronLeft size={20} />
      </button>

      <button
        className={`
          ${next}
          absolute right-2 top-1/2 -translate-y-1/2 z-10
          h-10 w-10 rounded-full
          border border-border/60
          bg-background/80 backdrop-blur
          flex items-center justify-center
          shadow-sm hover:shadow-md
          hover:bg-primary hover:text-primary-foreground
          transition
        `}
      >
        <ChevronRight size={20} />
      </button>
    </>
  )
}

export const EpisodesSlider: React.FC<Props> = ({ animeId }) => {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSeason, setCurrentSeason] = useState<number | null>(null)
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    async function fetchEpisodes() {
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
      const episode = Number(searchParams.get('episode')) || sorted[0]?.episodeNumber

      setCurrentSeason(season)
      setCurrentEpisode(
        sorted.find((ep: any) => ep.season === season && ep.episodeNumber === episode) || sorted[0],
      )

      setLoading(false)
    }

    fetchEpisodes()
  }, [animeId, searchParams])

  useEffect(() => {
    if (currentSeason && currentEpisode) {
      const params = new URLSearchParams()
      params.set('season', String(currentSeason))
      params.set('episode', String(currentEpisode.episodeNumber))
      router.replace(`?${params}`, { scroll: false })
    }
  }, [currentSeason, currentEpisode, router])

  if (loading) {
    return (
      <div className="mt-8 space-y-4 animate-pulse">
        <div className="h-6 w-40 bg-muted rounded" />
        <div className="h-40 bg-muted rounded-2xl" />
      </div>
    )
  }

  if (!episodes.length) {
    return <p className="mt-8 text-muted-foreground">Эпизоды отсутствуют.</p>
  }

  const seasons: Record<number, Episode[]> = {}
  episodes.forEach((ep) => {
    if (!seasons[ep.season]) seasons[ep.season] = []
    seasons[ep.season].push(ep)
  })

  return (
    <section className="mt-12 space-y-8">
      {/* HEADER */}
      <div className="flex items-center gap-2">
        <Layers size={22} className="text-primary" />
        <h2 className="text-2xl font-bold">Эпизоды</h2>
      </div>

      {/* SLIDER */}
      {currentSeason && (
        <div className="relative ">
          <SliderNav prev="ep-prev" next="ep-next" />

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
              const active = currentEpisode?.id === ep.id

              return (
                <SwiperSlide key={ep.id} className="p-1">
                  <div
                    onClick={() => ep.videoLink && setCurrentEpisode(ep)}
                    className={`
                      flex flex-col items-center h-full cursor-pointer rounded-xl border p-4
                      transition-all
                      ${
                        active
                          ? 'border-primary bg-primary/10 shadow-md scale-[1.02]'
                          : 'border-border/60 bg-background/60 hover:-translate-y-0.5'
                      }
                    `}
                  >
                    <div className="text-sm font-semibold">Эпизод {ep.episodeNumber}</div>

                    <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {ep.title}
                    </div>

                    {ep.videoLink && (
                      <div
                        className={`
                          mt-4 flex items-center justify-center gap-2 text-xs font-medium
                          ${
                            active
                              ? 'text-primary'
                              : 'text-muted-foreground group-hover:text-primary'
                          }
                        `}
                      >
                        <Play size={16} />
                        Смотреть
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      )}

      {/* VIDEO */}
      {currentEpisode?.videoLink && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            Сезон {currentEpisode.season}, Эпизод {currentEpisode.episodeNumber}
          </h3>

          <div className="relative aspect-video rounded-2xl overflow-hidden border border-border/60 shadow-lg">
            <iframe
              src={currentEpisode.videoLink}
              title={`Эпизод ${currentEpisode.episodeNumber}`}
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      )}
    </section>
  )
}
