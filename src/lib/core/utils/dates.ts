import { convert, LocalDate, LocalDateTime } from "@js-joda/core";

const shortDateFormat = Intl.DateTimeFormat([], {
  dateStyle: "medium",
});

export const shortDate = (date: LocalDate | LocalDateTime) => {
  const nativeDate = convert(date).toDate();
  return shortDateFormat.format(nativeDate);
};
