export type DiagramKey = "ai" | "cards" | "identity" | "tax";

export type ApiErrorCode = "internal_error" | "not_found";

export interface ApiErrorItem {
  code: ApiErrorCode;
  field: string | null;
  message: string;
}

export interface ApiErrorResponse {
  errors: ApiErrorItem[];
}

export interface ListItem {
  id: number;
  position: number;
  text: string;
}

export interface LabelItem {
  id: number;
  label: string;
  position: number;
}

export interface ExperienceSub {
  date_label: string;
  label: string;
}

export interface Experience {
  company: string;
  dates_label: string;
  duration_label: string | null;
  education: boolean;
  highlights: string[];
  id: number;
  position: number;
  role: string;
  subs: ExperienceSub[];
  summary: string;
  tags: string[];
  watermark: string | null;
  year_label: string;
}

export interface CaseStudy {
  description: string;
  diagram_key: DiagramKey;
  headline: string;
  id: number;
  metric: string | null;
  number: string;
  position: number;
  role: string;
  slug: string;
  tags: string[];
  title: string;
  years_label: string;
}

export interface Profile {
  email: string;
  footer_blurb: string;
  github_url: string;
  linkedin_url: string;
  location: string;
  name: string;
  role: string;
}

export interface ProfileResponse {
  profile: Profile;
}

export interface HeroSection {
  greeting_prefix: string;
  greetings: ListItem[];
  tagline: string;
}

export interface ExperienceSection {
  experiences: Experience[];
}

export interface SelectedWorkSection {
  case_studies: CaseStudy[];
  intro: string;
}

export interface CapabilityItem {
  id: number;
  name: string;
  position: number;
}

export interface CapabilityGroup {
  capabilities: CapabilityItem[];
  id: number;
  position: number;
  title: string;
}

export interface CapabilitiesSection {
  domains: LabelItem[];
  groups: CapabilityGroup[];
  intro: string;
  ticker: LabelItem[];
  title: string;
}

export interface Home {
  capabilities: CapabilitiesSection;
  experience: ExperienceSection;
  hero: HeroSection;
  selected_work: SelectedWorkSection;
}

export interface HomeResponse {
  home: Home;
}

export interface WorkHeader {
  intro: string;
}

export interface Work {
  case_studies: CaseStudy[];
  header: WorkHeader;
}

export interface WorkResponse {
  work: Work;
}

export interface AboutIntro {
  heading: string;
  subline: string;
}

export interface ChatMessage {
  answer: string;
  highlights: string[];
  id: number;
  position: number;
  question: string;
}

export interface Hobby {
  id: number;
  image_path: string;
  name: string;
  photo: boolean;
  position: number;
}

export interface HobbiesSection {
  earlier_roles: ListItem[];
  items: Hobby[];
}

export interface About {
  conversation: ChatMessage[];
  hobbies: HobbiesSection;
  intro: AboutIntro;
  timeline: Experience[];
}

export interface AboutResponse {
  about: About;
}

export interface QueryResponses {
  about: AboutResponse;
  home: HomeResponse;
  profile: ProfileResponse;
  work: WorkResponse;
}

export type QueryKey = keyof QueryResponses;

export type UiStrings = Record<string, string>;

export interface PageBootstrap {
  queries: Partial<QueryResponses>;
  ui: UiStrings;
}
