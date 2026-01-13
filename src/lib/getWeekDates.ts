export function getWeekDates() {
  const today = new Date()
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)
    return d.toLocaleDateString('en-CA')
  })
}
