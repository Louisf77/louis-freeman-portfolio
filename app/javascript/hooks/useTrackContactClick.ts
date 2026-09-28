import { useCallback } from "react";
import { useLocation } from "react-router";

import { pageTypeFor, track, type ContactLocation, type ContactMethod } from "~/lib/analytics";

function useTrackContactClick(location: ContactLocation): (method: ContactMethod) => void {
  const { pathname } = useLocation();

  return useCallback(
    (method: ContactMethod) => {
      const pageType = pageTypeFor(pathname);
      if (pageType === undefined) return;

      track("contact_click", { location, method, page_type: pageType });
    },
    [location, pathname],
  );
}

export default useTrackContactClick;
