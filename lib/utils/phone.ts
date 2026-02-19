import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js'

export function formatE164(phone: string, defaultCountry: string = 'US'): string {
  try {
    if (!phone) return ''

    const parsed = parsePhoneNumber(phone, defaultCountry as any)
    return parsed ? parsed.format('E.164') : phone
  } catch (error) {
    return phone
  }
}

export function validatePhone(phone: string, defaultCountry: string = 'US'): boolean {
  try {
    return isValidPhoneNumber(phone, defaultCountry as any)
  } catch (error) {
    return false
  }
}

export function formatDisplayPhone(phone: string): string {
  try {
    if (!phone) return ''

    const parsed = parsePhoneNumber(phone)
    return parsed ? parsed.formatNational() : phone
  } catch (error) {
    return phone
  }
}

export function maskPhoneNumber(phone: string): string {
  try {
    if (!phone) return ''

    const parsed = parsePhoneNumber(phone)
    if (!parsed) return phone

    const national = parsed.formatNational()
    const parts = national.split(' ')

    if (parts.length >= 2) {
      return `${parts[0]} ***-${parts[parts.length - 1]}`
    }

    return phone
  } catch (error) {
    return phone
  }
}
