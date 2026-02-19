import { format, addHours, startOfDay, parse } from 'date-fns'
import { toZonedTime, fromZonedTime } from 'date-fns-tz'

export interface BusinessHours {
  mon?: string[]
  tue?: string[]
  wed?: string[]
  thu?: string[]
  fri?: string[]
  sat?: string[]
  sun?: string[]
}

const DAY_MAP: Record<number, keyof BusinessHours> = {
  0: 'sun',
  1: 'mon',
  2: 'tue',
  3: 'wed',
  4: 'thu',
  5: 'fri',
  6: 'sat',
}

export function isWithinBusinessHours(
  date: Date,
  businessHours: BusinessHours,
  timezone: string
): boolean {
  try {
    const zonedDate = toZonedTime(date, timezone)
    const dayOfWeek = zonedDate.getDay()
    const dayKey = DAY_MAP[dayOfWeek]

    const hours = businessHours[dayKey]
    if (!hours || hours.length === 0) {
      return false
    }

    const [openTime, closeTime] = hours
    if (!openTime || !closeTime) {
      return false
    }

    const currentMinutes = zonedDate.getHours() * 60 + zonedDate.getMinutes()
    const [openHour, openMin] = openTime.split(':').map(Number)
    const [closeHour, closeMin] = closeTime.split(':').map(Number)

    const openMinutes = openHour * 60 + openMin
    const closeMinutes = closeHour * 60 + closeMin

    return currentMinutes >= openMinutes && currentMinutes < closeMinutes
  } catch (error) {
    return false
  }
}

export function getNextBusinessTime(
  currentDate: Date,
  businessHours: BusinessHours,
  timezone: string
): Date {
  try {
    const zonedDate = toZonedTime(currentDate, timezone)

    for (let daysAhead = 0; daysAhead < 8; daysAhead++) {
      const checkDate = new Date(zonedDate)
      checkDate.setDate(checkDate.getDate() + daysAhead)

      const dayOfWeek = checkDate.getDay()
      const dayKey = DAY_MAP[dayOfWeek]
      const hours = businessHours[dayKey]

      if (hours && hours.length >= 2) {
        const [openTime] = hours
        const [openHour, openMin] = openTime.split(':').map(Number)

        const openingTime = new Date(checkDate)
        openingTime.setHours(openHour, openMin, 0, 0)

        if (daysAhead === 0 && openingTime <= zonedDate) {
          continue
        }

        return fromZonedTime(openingTime, timezone)
      }
    }

    return currentDate
  } catch (error) {
    return currentDate
  }
}

export function formatTimeForDisplay(date: Date | string): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    return format(d, 'MMM d, yyyy h:mm a')
  } catch (error) {
    return ''
  }
}

export function formatRelativeTime(date: Date | string): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`

    return format(d, 'MMM d, yyyy')
  } catch (error) {
    return ''
  }
}
