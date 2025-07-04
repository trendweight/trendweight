import { convert, LocalDate, LocalDateTime } from "@js-joda/core"

const shortDateFormatter = Intl.DateTimeFormat([], {
  dateStyle: "medium",
})

const recentDateFormatter = new Intl.DateTimeFormat([], { 
  weekday: "short", 
  month: "short", 
  day: "numeric" 
})

export const shortDate = (date: LocalDate | LocalDateTime) => {
  const nativeDate = convert(date).toDate()
  return shortDateFormatter.format(nativeDate)
}

export const recentDate = (date: LocalDate | LocalDateTime) => {
  const nativeDate = convert(date).toDate()
  return recentDateFormatter.format(nativeDate)
}