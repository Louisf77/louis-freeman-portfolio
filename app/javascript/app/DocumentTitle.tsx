import { useEffect } from "react";
import { useLocation } from "react-router";

import { useUi } from "~/lib/ui";

const PAGE_TITLE_KEY: Record<string, string> = {
  "/": "page_title_home",
  "/about": "page_title_about",
  "/work": "page_title_work",
};

const TRAILING_SLASHES = /(?<=.)\/+$/;

function DocumentTitle() {
  const { pathname } = useLocation();
  const t = useUi();

  useEffect(() => {
    const titleKey = PAGE_TITLE_KEY[pathname.replace(TRAILING_SLASHES, "")];
    if (!titleKey) return;

    document.title = t(titleKey);
  }, [pathname, t]);

  return null;
}

export default DocumentTitle;
