import type { CSSProperties } from "react";

import Tag from "~/components/Tag/Tag";
import styles from "~/features/home/components/ExperienceCard.module.css";
import classNames from "~/lib/classNames";
import { useUi } from "~/lib/ui";
import type { Experience } from "~/types/contracts";

export type DeckPosition = "far" | "gone" | "next" | "nextButOne" | "top";

interface ExperienceCardAria {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-roledescription"?: string;
  id: string;
  role: "group" | "tabpanel";
}

interface ExperienceCardProps {
  aria: ExperienceCardAria;
  experience: Experience;
  isCompact: boolean;
  isHidden: boolean;
  position: DeckPosition;
  stackIndex: number;
}

const SPARSE_HIGHLIGHT_THRESHOLD = 3;
const LONG_WATERMARK_LENGTH = 8;
const TOP_STACK_LAYER = 10;

const POSITION_CLASS: Record<DeckPosition, string | undefined> = {
  far: styles.far,
  gone: styles.gone,
  next: styles.next,
  nextButOne: styles.nextButOne,
  top: styles.top,
};

const POSITION_BY_OFFSET: Record<number, DeckPosition> = {
  0: "top",
  1: "next",
  2: "nextButOne",
};

export function deckPositionOf(index: number, activeIndex: number): DeckPosition {
  if (index < activeIndex) return "gone";

  return POSITION_BY_OFFSET[index - activeIndex] ?? "far";
}

function ExperienceCard({
  aria,
  experience,
  isCompact,
  isHidden,
  position,
  stackIndex,
}: ExperienceCardProps) {
  const t = useUi();
  const watermark = experience.watermark ?? experience.company;
  const isSparse = experience.highlights.length < SPARSE_HIGHLIGHT_THRESHOLD;
  const isLeadSummary = isSparse && !isCompact;
  const isDurationShown = experience.duration_label !== null && (isCompact || isSparse);
  const isSubsShown = !isCompact && experience.subs.length > 0;
  const layerStyle: CSSProperties = { zIndex: TOP_STACK_LAYER - stackIndex };

  return (
    <div
      {...aria}
      aria-hidden={isHidden}
      className={classNames(
        styles.card,
        isCompact && styles.compact,
        experience.education && styles.education,
        POSITION_CLASS[position],
      )}
      inert={isHidden}
      style={layerStyle}
      tabIndex={aria.role === "tabpanel" && !isHidden ? 0 : undefined}
    >
      <span
        aria-hidden="true"
        className={classNames(
          styles.watermark,
          watermark.length > LONG_WATERMARK_LENGTH && styles.watermarkLong,
        )}
        data-watermark={watermark}
      />
      <div className={styles.header}>
        <div className={styles.titles}>
          <h3 className={styles.company}>{experience.company}</h3>
          <p className={styles.role}>{experience.role}</p>
        </div>
        <Tag as="span" variant="dates">
          {experience.dates_label}
        </Tag>
      </div>
      <p className={classNames(styles.summary, isLeadSummary && styles.lead)}>
        {experience.summary}
      </p>
      {isDurationShown && (
        <p className={styles.duration}>
          <span className={styles.label}>{t("experience_time_there")}</span>
          <span>{experience.duration_label}</span>
        </p>
      )}
      {experience.highlights.length > 0 && (
        <ul className={styles.highlights}>
          {experience.highlights.map((highlight) => (
            <li className={styles.highlight} key={highlight}>
              <span aria-hidden="true" className={styles.bullet} />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}
      <div className={styles.footer}>
        {experience.tags.length > 0 && (
          <ul aria-label={t("experience_technologies")} className={styles.tags}>
            {experience.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </ul>
        )}
        {isSubsShown && (
          <ul className={styles.subs}>
            {experience.subs.map((sub) => (
              <li className={styles.sub} key={`${sub.date_label}-${sub.label}`}>
                <span className={classNames(styles.label, styles.subDate)}>{sub.date_label}</span>
                {sub.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ExperienceCard;
