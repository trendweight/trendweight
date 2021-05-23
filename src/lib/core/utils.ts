import { convert, LocalDate, LocalDateTime } from "@js-joda/core";
import { useCallback, useState } from "react";

export const toJson = (object: unknown) => {
  return JSON.stringify(object, undefined, 2);
};

export const useDisclosure = (isOpenDefault = false) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((state) => !state), []);
  return { isOpen, open, close, toggle };
};

export const log = (message?: unknown, ...optionalParams: unknown[]) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(message, ...optionalParams);
  }
};

export const logCall = (methodName: string, ...optionalParams: unknown[]) => {
  log(`[${methodName}]`, ...optionalParams);
};

const shortDateFormat = Intl.DateTimeFormat([], {
  dateStyle: "medium",
});

export const shortDate = (date: LocalDate | LocalDateTime) => {
  const nativeDate = convert(date).toDate();
  return shortDateFormat.format(nativeDate);
};
