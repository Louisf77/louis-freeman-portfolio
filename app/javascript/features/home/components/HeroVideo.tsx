import { useCallback, useEffect, useRef } from "react";

import heroPoster from "~/assets/hero-poster.jpg";
import heroVideo from "~/assets/hero.mp4";
import styles from "~/features/home/components/HeroSection.module.css";
import useReducedMotion from "~/hooks/useReducedMotion";
import { useUi } from "~/lib/ui";

const PLAYBACK_RETRY_EVENTS = ["canplay", "loadeddata"] as const;
const NO_MEDIA_LOADED = 0;

function HeroVideo() {
  const t = useUi();
  const isReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  const playIfPaused = useCallback(() => {
    const video = videoRef.current;
    if (!video?.paused) return;

    Promise.resolve(video.play()).catch(() => undefined);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    video.muted = true;
    video.defaultMuted = true;
    if (video.readyState === NO_MEDIA_LOADED) video.load();
    playIfPaused();

    PLAYBACK_RETRY_EVENTS.forEach((eventName) => {
      video.addEventListener(eventName, playIfPaused);
    });
    document.addEventListener("visibilitychange", playIfPaused);

    return () => {
      PLAYBACK_RETRY_EVENTS.forEach((eventName) => {
        video.removeEventListener(eventName, playIfPaused);
      });
      document.removeEventListener("visibilitychange", playIfPaused);
    };
  }, [isReducedMotion, playIfPaused]);

  return (
    <figure className={styles.stage}>
      {isReducedMotion ? (
        <img alt={t("hero_poster_alt")} className={styles.media} src={heroPoster} />
      ) : (
        <video
          aria-label={t("hero_video_label")}
          autoPlay
          className={styles.media}
          loop
          muted
          playsInline
          poster={heroPoster}
          preload="auto"
          ref={videoRef}
          src={heroVideo}
        />
      )}
    </figure>
  );
}

export default HeroVideo;
