import { fetchJson } from "~/lib/apiClient";
import { api_v1_profile_path } from "~/lib/apiRoutes";
import type { ProfileResponse } from "~/types/contracts";

export function fetchProfile(): Promise<ProfileResponse> {
  return fetchJson<ProfileResponse>(api_v1_profile_path());
}
