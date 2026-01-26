// app/page.tsx
import { Suspense } from 'react'
import HomeClient from './HomeClient'
import Hero from '@/components/hero/Hero'
import { CalendarMini } from '@/components/calendar/CalendarMini'

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <div className="container">
        <Hero />
        <CalendarMini />
      </div>

      <HomeClient />
    </Suspense>
  )
}
