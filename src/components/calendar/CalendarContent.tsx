import { getEpisodesCalendar } from '@/lib/getEpisodesCalendar'
import { groupEpisodesByDate } from '@/lib/groupEpisodesByDate'
import { getWeekDates } from '@/lib/getWeekDates'
import { DaySection } from './DaySection'

export async function CalendarContent() {
  const today = new Date()

  const from = today.toLocaleDateString('en-CA')
  const to = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 7,
  ).toLocaleDateString('en-CA')

  const episodes = await getEpisodesCalendar(from, to)
  const grouped = groupEpisodesByDate(episodes)
  const weekDates = getWeekDates()

  return (
    <div className="space-y-4 sm:space-y-6">
      {weekDates.map((date) => (
        <DaySection key={date} date={date} episodes={grouped[date] ?? []} todayISO={from} />
      ))}
    </div>
  )
}
