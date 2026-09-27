import { useEffect, useRef } from "react";

export default function useAutoplay(isEnabled: boolean, intervalMs: number, onTick: () => void) {
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    if (!isEnabled) return undefined;

    const interval = window.setInterval(() => {
      onTickRef.current();
    }, intervalMs);

    return () => {
      window.clearInterval(interval);
    };
  }, [intervalMs, isEnabled]);
}
