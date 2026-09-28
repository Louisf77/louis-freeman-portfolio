import { about_path, root_path, work_path } from "~/lib/routes";

export type CaseStudySource = "home_link" | "work_scroll";
export type ContactLocation = "footer" | "nav";
export type ContactMethod = "email" | "github" | "linkedin";
export type PageType = "about" | "home" | "work";

export interface AnalyticsEvents {
  case_study_view: { case_study_slug: string; source: CaseStudySource };
  contact_click: { location: ContactLocation; method: ContactMethod; page_type: PageType };
}

export type AnalyticsEventName = keyof AnalyticsEvents;

interface Umami {
  track: (event: string, data: object) => Promise<unknown> | undefined;
}

declare global {
  interface Window {
    umami?: Umami;
  }
}

const PAGE_TYPE_BY_PATH: Record<string, PageType> = {
  [about_path()]: "about",
  [root_path()]: "home",
  [work_path()]: "work",
};

interface CaseStudyLandingState {
  landedCaseStudySlug: string;
}

export function caseStudyLandingState(slug: string): CaseStudyLandingState {
  return { landedCaseStudySlug: slug };
}

function isCaseStudyLandingState(state: unknown): state is CaseStudyLandingState {
  return (
    typeof state === "object" &&
    state !== null &&
    typeof (state as Partial<CaseStudyLandingState>).landedCaseStudySlug === "string"
  );
}

export function landedCaseStudySlugFrom(state: unknown): string | undefined {
  return isCaseStudyLandingState(state) ? state.landedCaseStudySlug : undefined;
}

export function pageTypeFor(pathname: string): PageType | undefined {
  return PAGE_TYPE_BY_PATH[pathname];
}

function ignoreFailedDelivery() {
  return undefined;
}

export function track<Name extends AnalyticsEventName>(
  event: Name,
  data: AnalyticsEvents[Name],
): void {
  window.umami?.track(event, data)?.catch(ignoreFailedDelivery);
}
