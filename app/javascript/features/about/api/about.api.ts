import { fetchJson } from "~/lib/apiClient";
import { api_v1_about_path } from "~/lib/routes";
import type { AboutResponse } from "~/types/contracts";

export function fetchAbout(): Promise<AboutResponse> {
  return fetchJson<AboutResponse>(api_v1_about_path());
}
