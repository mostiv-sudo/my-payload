import { Suspense } from 'react'
import { CalendarSkeleton } from '@/components/calendar/CalendarSkeleton'
import { CalendarContent } from '@/components/calendar/CalendarContent'

export const dynamic = 'force-dynamic'

export default function CalendarPage() {
  return (
    <div className="container px-4 py-6 sm:py-10 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">📅 Календарь релизов</h1>
        <p className="text-sm text-muted-foreground">Ближайшие релизы на 7 дней</p>
      </header>

      <Suspense fallback={<CalendarSkeleton />}>
        <CalendarContent />
      </Suspense>
    </div>
  )
}
