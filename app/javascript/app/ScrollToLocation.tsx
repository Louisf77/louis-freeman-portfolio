import { useEffect } from "react";
import { useLocation } from "react-router";

const MAX_TARGET_LOOKUP_FRAMES = 120;

function ScrollToLocation() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ behavior: "instant", left: 0, top: 0 });
      return undefined;
    }

    const targetId = decodeURIComponent(hash.slice(1));
    let framesLeft = MAX_TARGET_LOOKUP_FRAMES;
    let frame = 0;

    const scrollToTarget = () => {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView();
        return;
      }

      framesLeft -= 1;
      if (framesLeft > 0) frame = window.requestAnimationFrame(scrollToTarget);
    };

    scrollToTarget();

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [hash, pathname]);

  return null;
}

export default ScrollToLocation;
