import { queryOptions, useQuery } from "@tanstack/react-query";

import { useBootstrapQuery } from "~/lib/bootstrapQueries";

import { fetchProfile } from "~/lib/api/profile.api";

export const PROFILE_QUERY_KEY = ["profile"] as const;

export function useProfileQuery() {
  const bootstrapped = useBootstrapQuery("profile");

  return useQuery(
    queryOptions({
      initialData: () => bootstrapped,
      queryFn: fetchProfile,
      queryKey: PROFILE_QUERY_KEY,
    }),
  );
}

export function useIsWorkPublished(): boolean {
  const { data } = useProfileQuery();

  return data?.profile.work_published ?? false;
}
