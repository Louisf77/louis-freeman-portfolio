import type { ApiErrorResponse } from "~/types/contracts";

const JSON_HEADERS = { Accept: "application/json" };

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function isApiErrorResponse(body: unknown): body is ApiErrorResponse {
  return (
    typeof body === "object" &&
    body !== null &&
    Array.isArray((body as Partial<ApiErrorResponse>).errors)
  );
}

async function readErrorMessage(response: Response): Promise<string> {
  const fallback = `${response.url} responded ${String(response.status)}`;

  try {
    const body: unknown = await response.json();
    if (!isApiErrorResponse(body)) return fallback;

    return body.errors.map((error) => error.message).join(" ") || fallback;
  } catch {
    return fallback;
  }
}

export async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { headers: JSON_HEADERS });
  if (!response.ok) throw new ApiError(await readErrorMessage(response), response.status);

  return (await response.json()) as T;
}
