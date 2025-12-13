'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

import { AnimeCard } from './AnimeSection'

export function AnimeSwiper({ items }: { items: any[] }) {
  return (
    <Swiper
      modules={[Autoplay]}
      spaceBetween={20}
      slidesPerView={2}
      autoplay={{
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      breakpoints={{
        640: { slidesPerView: 3 },
        1024: { slidesPerView: 5 },
        1280: { slidesPerView: 6 },
      }}
      className="!pb-2"
    >
      {items.map((anime) => (
        <SwiperSlide key={anime.id} className="h-auto">
          <AnimeCard anime={anime} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
