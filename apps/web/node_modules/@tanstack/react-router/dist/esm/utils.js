import * as React from "react";
function useStableCallback(fn) {
  const fnRef = React.useRef(fn);
  fnRef.current = fn;
  const ref = React.useRef((...args) => fnRef.current(...args));
  return ref.current;
}
const useLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;
function usePrevious(value) {
  const ref = React.useRef({
    value,
    prev: null
  });
  const current = ref.current.value;
  if (value !== current) {
    ref.current = {
      value,
      prev: current
    };
  }
  return ref.current.prev;
}
function useIntersectionObserver(ref, callback, intersectionObserverOptions = {}, options = {}) {
  const isIntersectionObserverAvailable = React.useRef(
    typeof IntersectionObserver === "function"
  );
  const observerRef = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || !isIntersectionObserverAvailable.current || options.disabled) {
      return;
    }
    observerRef.current = new IntersectionObserver(([entry]) => {
      callback(entry);
    }, intersectionObserverOptions);
    observerRef.current.observe(ref.current);
    return () => {
      var _a;
      (_a = observerRef.current) == null ? void 0 : _a.disconnect();
    };
  }, [callback, intersectionObserverOptions, options.disabled, ref]);
  return observerRef.current;
}
function useForwardedRef(ref) {
  const innerRef = React.useRef(null);
  React.useImperativeHandle(ref, () => innerRef.current, []);
  return innerRef;
}
export {
  useForwardedRef,
  useIntersectionObserver,
  useLayoutEffect,
  usePrevious,
  useStableCallback
};
//# sourceMappingURL=utils.js.map
