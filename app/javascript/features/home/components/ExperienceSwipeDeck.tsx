import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";

import ExperienceCard, { deckPositionOf } from "~/features/home/components/ExperienceCard";
import styles from "~/features/home/components/ExperienceSwipeDeck.module.css";
import useAutoplay from "~/features/home/hooks/useAutoplay";
import useReducedMotion from "~/hooks/useReducedMotion";
import classNames from "~/lib/classNames";
import { useUi } from "~/lib/ui";
import type { Experience } from "~/types/contracts";

interface ExperienceSwipeDeckProps {
  experiences: Experience[];
  headingId: string;
}

interface TouchPoint {
  x: number;
  y: number;
}

const AUTOPLAY_INTERVAL_MS = 4200;
const SWIPE_THRESHOLD_PX = 40;
const COUNTER_DIGITS = 2;
const PREVIOUS_ARROW = "←";
const NEXT_ARROW = "→";

const FOCUSABLE_TAB_INDEX = 0;

const KEY_DIRECTIONS: Record<string, number | undefined> = {
  ArrowLeft: -1,
  ArrowRight: 1,
};

function padCount(value: number): string {
  return String(value).padStart(COUNTER_DIGITS, "0");
}

function ExperienceSwipeDeck({ experiences, headingId }: ExperienceSwipeDeckProps) {
  const t = useUi();
  const isReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplaying, setIsAutoplaying] = useState(true);
  const touchStartRef = useRef<TouchPoint | null>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const count = experiences.length;
  const lastIndex = count - 1;
  const isAdvancing = isAutoplaying && !isReducedMotion;

  useAutoplay(isAdvancing, AUTOPLAY_INTERVAL_MS, () => {
    setActiveIndex((index) => (index + 1) % count);
  });

  const moveBy = useCallback(
    (direction: number) => {
      setIsAutoplaying(false);
      setActiveIndex((index) => Math.min(lastIndex, Math.max(0, index + direction)));
    },
    [lastIndex],
  );

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = KEY_DIRECTIONS[event.key];
      if (direction === undefined) return;

      event.preventDefault();
      moveBy(direction);
    };

    deck.addEventListener("keydown", handleKeyDown);

    return () => {
      deck.removeEventListener("keydown", handleKeyDown);
    };
  }, [moveBy]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStartRef.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    const touch = event.changedTouches[0];
    touchStartRef.current = null;
    if (!start || !touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    const isHorizontalSwipe =
      Math.abs(deltaX) > SWIPE_THRESHOLD_PX && Math.abs(deltaX) > Math.abs(deltaY);
    if (isHorizontalSwipe) moveBy(deltaX < 0 ? 1 : -1);
  };

  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <h2 className={styles.heading} id={headingId}>
          {t("experience_heading")}
        </h2>
        <span aria-live={isAdvancing ? "off" : "polite"} className={styles.counter}>
          {t("experience_counter", {
            current: padCount(activeIndex + 1),
            total: padCount(count),
          })}
        </span>
      </div>
      <div
        aria-labelledby={headingId}
        aria-roledescription={t("experience_deck_description")}
        className={styles.deck}
        onFocus={() => {
          setIsAutoplaying(false);
        }}
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
        ref={deckRef}
        role="group"
        tabIndex={FOCUSABLE_TAB_INDEX}
      >
        {experiences.map((experience, index) => (
          <ExperienceCard
            aria={{
              "aria-label": t("experience_slide_label", { current: index + 1, total: count }),
              "aria-roledescription": t("experience_slide_description"),
              id: `experience-slide-${String(experience.id)}`,
              role: "group",
            }}
            experience={experience}
            isCompact
            isHidden={index !== activeIndex}
            key={experience.id}
            position={deckPositionOf(index, activeIndex)}
            stackIndex={index}
          />
        ))}
      </div>
      <div className={styles.controls}>
        <button
          aria-label={t("experience_previous")}
          className={styles.arrow}
          disabled={activeIndex === 0}
          onClick={() => {
            moveBy(-1);
          }}
          type="button"
        >
          <span aria-hidden="true">{PREVIOUS_ARROW}</span>
        </button>
        <div aria-hidden="true" className={styles.progress}>
          {experiences.map((experience, index) => (
            <i
              className={classNames(styles.step, index === activeIndex && styles.stepActive)}
              key={experience.id}
            />
          ))}
        </div>
        <button
          aria-label={t("experience_next")}
          className={styles.arrow}
          disabled={activeIndex === lastIndex}
          onClick={() => {
            moveBy(1);
          }}
          type="button"
        >
          <span aria-hidden="true">{NEXT_ARROW}</span>
        </button>
      </div>
    </div>
  );
}

export default ExperienceSwipeDeck;
