import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

import styles from "~/features/home/components/ExperienceDeck.module.css";
import ExperienceCard, { deckPositionOf } from "~/features/home/components/ExperienceCard";
import useReducedMotion from "~/hooks/useReducedMotion";
import useScrollProgress from "~/hooks/useScrollProgress";
import classNames from "~/lib/classNames";
import { useUi } from "~/lib/ui";
import type { Experience } from "~/types/contracts";

interface ExperienceDeckProps {
  experiences: Experience[];
  headingId: string;
}

type IndexStep = (index: number, count: number) => number;

const CARD_CENTRE_OFFSET = 0.5;

const KEY_STEPS: Record<string, IndexStep | undefined> = {
  ArrowDown: (index, count) => (index + 1) % count,
  ArrowLeft: (index, count) => (index - 1 + count) % count,
  ArrowRight: (index, count) => (index + 1) % count,
  ArrowUp: (index, count) => (index - 1 + count) % count,
  End: (_index, count) => count - 1,
  Home: () => 0,
};

function cardId(experience: Experience): string {
  return `experience-card-${String(experience.id)}`;
}

function tabId(experience: Experience): string {
  return `experience-tab-${String(experience.id)}`;
}

function ExperienceDeck({ experiences, headingId }: ExperienceDeckProps) {
  const t = useUi();
  const isScrollDriven = !useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pickedIndex, setPickedIndex] = useState(0);
  const scrollProgress = useScrollProgress(trackRef);
  const count = experiences.length;
  const activeIndex = isScrollDriven
    ? Math.min(count - 1, Math.floor(scrollProgress * count))
    : pickedIndex;
  const activeExperience = experiences[activeIndex];
  const trackStyle = { "--deck-steps": count } as CSSProperties;

  const scrollToCard = (index: number) => {
    const track = trackRef.current;
    if (!track) return;

    const { height, top } = track.getBoundingClientRect();
    const scrollableDistance = Math.max(1, height - window.innerHeight);
    window.scrollTo({
      behavior: "smooth",
      top: top + window.scrollY + ((index + CARD_CENTRE_OFFSET) / count) * scrollableDistance,
    });
  };

  const showCard = (index: number) => {
    if (isScrollDriven) scrollToCard(index);
    else setPickedIndex(index);
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = KEY_STEPS[event.key];
    if (!step) return;

    event.preventDefault();
    const target = step(index, count);
    tabRefs.current[target]?.focus();
    showCard(target);
  };

  return (
    <div className={classNames(isScrollDriven && styles.track)} ref={trackRef} style={trackStyle}>
      <div className={classNames(styles.stage, isScrollDriven && styles.stageSticky)}>
        <div className={styles.aside}>
          <h2 className={styles.heading} id={headingId}>
            {t("experience_heading")}
          </h2>
          <p aria-hidden="true" className={styles.year} key={activeIndex}>
            {activeExperience?.year_label}
          </p>
          <div
            aria-label={t("experience_companies_label")}
            aria-orientation="vertical"
            className={styles.companies}
            role="tablist"
          >
            {experiences.map((experience, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  aria-controls={cardId(experience)}
                  aria-selected={isActive}
                  className={classNames(styles.company, isActive && styles.companyActive)}
                  id={tabId(experience)}
                  key={experience.id}
                  onClick={() => {
                    showCard(index);
                  }}
                  onKeyDown={(event) => {
                    handleTabKeyDown(event, index);
                  }}
                  ref={(element) => {
                    tabRefs.current[index] = element;
                  }}
                  role="tab"
                  tabIndex={isActive ? 0 : -1}
                  type="button"
                >
                  <i aria-hidden="true" className={styles.companyBar} />
                  {experience.company}
                </button>
              );
            })}
          </div>
          <p className={styles.hint}>
            {t(isScrollDriven ? "experience_hint_scroll" : "experience_hint_static")}
          </p>
        </div>
        <div className={styles.deck}>
          {experiences.map((experience, index) => (
            <ExperienceCard
              aria={{
                "aria-labelledby": tabId(experience),
                id: cardId(experience),
                role: "tabpanel",
              }}
              experience={experience}
              isCompact={false}
              isHidden={index !== activeIndex}
              key={experience.id}
              position={deckPositionOf(index, activeIndex)}
              stackIndex={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExperienceDeck;
