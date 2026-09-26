import { queryOptions, useQuery } from "@tanstack/react-query";

import { useBootstrapQuery } from "~/lib/bootstrapQueries";

import { fetchWork } from "~/features/work/api/work.api";

export const WORK_QUERY_KEY = ["work"] as const;

export function useWorkQuery() {
  const bootstrapped = useBootstrapQuery("work");

  return useQuery(
    queryOptions({
      initialData: () => bootstrapped,
      queryFn: fetchWork,
      queryKey: WORK_QUERY_KEY,
    }),
  );
}
