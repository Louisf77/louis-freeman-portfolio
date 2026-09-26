import { fetchJson } from "~/lib/apiClient";
import { api_v1_home_path } from "~/lib/routes";
import type { HomeResponse } from "~/types/contracts";

export function fetchHome(): Promise<HomeResponse> {
  return fetchJson<HomeResponse>(api_v1_home_path());
}
