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
