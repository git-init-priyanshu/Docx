import { debounce } from "lodash";
import { useEffect, useMemo, useRef } from "react";

export default function useDebounce<D>(
  callbackFunction: ((value: D) => void) | ((value: D) => Promise<void>),
  debounceDelay: number,
) {
  const callbackRef = useRef(callbackFunction);

  useEffect(() => {
    callbackRef.current = callbackFunction;
  }, [callbackFunction ]);

  const debounceFunc = useMemo(
    () => debounce((value: D) => callbackRef.current(value), debounceDelay),
    [debounceDelay]
  );

  return debounceFunc;
}
