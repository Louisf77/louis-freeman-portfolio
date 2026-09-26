import { fetchJson } from "~/lib/apiClient";
import { api_v1_work_path } from "~/lib/routes";
import type { WorkResponse } from "~/types/contracts";

export function fetchWork(): Promise<WorkResponse> {
  return fetchJson<WorkResponse>(api_v1_work_path());
}
