import { queryOptions, useQuery } from "@tanstack/react-query";

import { useBootstrapQuery } from "~/lib/bootstrapQueries";

import { fetchHome } from "~/features/home/api/home.api";

export const HOME_QUERY_KEY = ["home"] as const;

export function useHomeQuery() {
  const bootstrapped = useBootstrapQuery("home");

  return useQuery(
    queryOptions({
      initialData: () => bootstrapped,
      queryFn: fetchHome,
      queryKey: HOME_QUERY_KEY,
    }),
  );
}
