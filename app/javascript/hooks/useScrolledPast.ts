import { useCallback, useSyncExternalStore } from "react";

function subscribeToScroll(onChange: () => void): () => void {
  window.addEventListener("scroll", onChange, { passive: true });

  return () => {
    window.removeEventListener("scroll", onChange);
  };
}

export default function useScrolledPast(threshold: number): boolean {
  const isPastThreshold = useCallback(() => window.scrollY > threshold, [threshold]);

  return useSyncExternalStore(subscribeToScroll, isPastThreshold, () => false);
}
