import { useEffect, useRef } from "react";

type EventHandler = (event: MouseEvent | TouchEvent) => void;

export function useOutsideClick<T extends HTMLElement>(
  handler: EventHandler,
  listenCapturing = true
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler(e);
      }
    }

    document.addEventListener("click", handleClick, listenCapturing);

    return () => document.removeEventListener("click", handleClick, listenCapturing);
  }, [handler, listenCapturing]);

  return ref;
}
