import {
  api_v1_about_path,
  api_v1_home_path,
  api_v1_profile_path,
  api_v1_work_path,
} from "~/lib/apiRoutes";

const FIXTURE_DIRECTORY = "../../../spec/fixtures/contracts/api/v1/";
const JSON_CONTENT_TYPE = { "Content-Type": "application/json" };

const fixtureModules = import.meta.glob<unknown>(
  "../../../spec/fixtures/contracts/api/v1/*/show.json",
  {
    eager: true,
    import: "default",
  },
);

const FIXTURE_NAME_BY_PATH: Record<string, string> = {
  [api_v1_about_path()]: "about",
  [api_v1_home_path()]: "home",
  [api_v1_profile_path()]: "profile",
  [api_v1_work_path()]: "work",
};

function requestPath(input: RequestInfo | URL): string {
  if (input instanceof Request) return new URL(input.url).pathname;

  return new URL(input.toString(), window.location.origin).pathname;
}

export function installContractFixtureFetch(): void {
  const networkFetch = window.fetch.bind(window);

  window.fetch = (input, init) => {
    const fixtureName = FIXTURE_NAME_BY_PATH[requestPath(input)];
    if (fixtureName === undefined) return networkFetch(input, init);

    const fixture = fixtureModules[`${FIXTURE_DIRECTORY}${fixtureName}/show.json`];

    return Promise.resolve(
      new Response(JSON.stringify(fixture), { headers: JSON_CONTENT_TYPE, status: 200 }),
    );
  };
}
