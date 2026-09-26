import type { PageBootstrap } from "~/types/contracts";

const BOOTSTRAP_ELEMENT_ID = "bootstrap";
const EMPTY_BOOTSTRAP: PageBootstrap = { queries: {}, ui: {} };

export function readPageBootstrap(): PageBootstrap {
  const element = document.getElementById(BOOTSTRAP_ELEMENT_ID);
  if (!element?.textContent) return EMPTY_BOOTSTRAP;

  return { ...EMPTY_BOOTSTRAP, ...(JSON.parse(element.textContent) as Partial<PageBootstrap>) };
}
