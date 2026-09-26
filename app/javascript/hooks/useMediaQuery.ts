import { useCallback, useSyncExternalStore } from "react";

export const COMPACT_MEDIA_QUERY = "(max-width: 760px)";

function matches(query: string): boolean {
  return typeof window.matchMedia === "function" && window.matchMedia(query).matches;
}

export default function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window.matchMedia !== "function") return () => undefined;

      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener("change", onChange);

      return () => {
        mediaQueryList.removeEventListener("change", onChange);
      };
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => matches(query),
    () => false,
  );
}
