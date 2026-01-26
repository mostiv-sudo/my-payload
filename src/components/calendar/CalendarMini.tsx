// components/calendar/CalendarMini.tsx
import { getEpisodesCalendar } from '@/lib/getEpisodesCalendar'
import { groupEpisodesByDate } from '@/lib/groupEpisodesByDate'
import { getWeekDates } from '@/lib/getWeekDates'
import { CalendarMiniUI } from './CalendarMini.ui'

export async function CalendarMini() {
  const today = new Date()

  const from = today.toLocaleDateString('en-CA')
  const to = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 2,
  ).toLocaleDateString('en-CA')

  const episodes = await getEpisodesCalendar(from, to)
  const grouped = groupEpisodesByDate(episodes)
  const dates = getWeekDates().slice(0, 2)

  return <CalendarMiniUI from={from} dates={dates} grouped={grouped} />
}
