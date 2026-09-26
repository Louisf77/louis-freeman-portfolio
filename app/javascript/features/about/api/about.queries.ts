import { queryOptions, useQuery } from "@tanstack/react-query";

import { useBootstrapQuery } from "~/lib/bootstrapQueries";

import { fetchAbout } from "~/features/about/api/about.api";

export const ABOUT_QUERY_KEY = ["about"] as const;

export function useAboutQuery() {
  const bootstrapped = useBootstrapQuery("about");

  return useQuery(
    queryOptions({
      initialData: () => bootstrapped,
      queryFn: fetchAbout,
      queryKey: ABOUT_QUERY_KEY,
    }),
  );
}
