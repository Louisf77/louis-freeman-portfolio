import useMediaQuery from "~/hooks/useMediaQuery";

export const REDUCED_MOTION_MEDIA_QUERY = "(prefers-reduced-motion: reduce)";

export default function useReducedMotion(): boolean {
  return useMediaQuery(REDUCED_MOTION_MEDIA_QUERY);
}
