type Event = {
  name?: string
  type?: string,
  date?: {
    start: string,
    end: string,
    timezone: string
  }
}

export function generateEventId(
  event: Event,
  existingIds: Set<string> = new Set()
): string {
  const namePart = (event.name ?? "event")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40) || "event"

  const start = event.date?.start ? new Date(event.date.start) : null

  let timePart = event.type == 'all-day-' ? "allday" : ""

  if (start && !isNaN(start.getTime())) {
    const yyyy = start.getUTCFullYear()
    const mm = String(start.getUTCMonth() + 1).padStart(2, "0")
    const dd = String(start.getUTCDate()).padStart(2, "0")
    const hh = String(start.getUTCHours()).padStart(2, "0")
    const min = String(start.getUTCMinutes()).padStart(2, "0")

    timePart = `${yyyy}${mm}${dd}${hh}${min}-`
  }

  const base = `e-${timePart}${namePart}`

  let candidate = base
  let i = 1

  while (existingIds.has(candidate)) {
    candidate = `${base}-${i}`
    i++
  }

  existingIds.add(candidate)

  return candidate
}