import { QueryClient } from "@tanstack/react-query";

import { ApiError } from "~/lib/apiClient";

const CONTENT_STALE_TIME_MS = 300_000;
const MAX_RETRIES = 1;
const FIRST_SERVER_ERROR_STATUS = 500;

function isRetryable(error: Error): boolean {
  return !(error instanceof ApiError && error.status < FIRST_SERVER_ERROR_STATUS);
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => isRetryable(error) && failureCount < MAX_RETRIES,
        staleTime: CONTENT_STALE_TIME_MS,
      },
    },
  });
}
