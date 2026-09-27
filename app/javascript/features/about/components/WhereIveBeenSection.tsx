import { useState } from "react";

import AboutSectionHeader from "~/features/about/components/AboutSectionHeader";
import TimelineRow from "~/features/about/components/TimelineRow";
import styles from "~/features/about/components/WhereIveBeenSection.module.css";
import useMediaQuery, { COMPACT_MEDIA_QUERY } from "~/hooks/useMediaQuery";
import { useUi } from "~/lib/ui";
import type { Experience } from "~/types/contracts";

interface WhereIveBeenSectionProps {
  timeline: Experience[];
}

const HEADING_ID = "experience-title";
const LIST_ID = "experience-list";
const COLLAPSED_ROLE_COUNT = 3;

function collapsedTimeline(timeline: Experience[]): Experience[] {
  const shownRoleIds = new Set(
    timeline
      .filter((entry) => !entry.education)
      .slice(0, COLLAPSED_ROLE_COUNT)
      .map((entry) => entry.id),
  );

  return timeline.filter((entry) => entry.education || shownRoleIds.has(entry.id));
}

function WhereIveBeenSection({ timeline }: WhereIveBeenSectionProps) {
  const t = useUi();
  const isCompact = useMediaQuery(COMPACT_MEDIA_QUERY);
  const [isExpanded, setIsExpanded] = useState(false);
  if (timeline.length === 0) return null;

  const collapsed = collapsedTimeline(timeline);
  const hiddenCount = timeline.length - collapsed.length;
  const isCollapsible = !isCompact && hiddenCount > 0;
  const visibleEntries = isCollapsible && !isExpanded ? collapsed : timeline;

  return (
    <section aria-labelledby={HEADING_ID} className={styles.section} id="experience">
      <AboutSectionHeader
        heading={t("where_ive_been_heading")}
        headingId={HEADING_ID}
        note={t("where_ive_been_order")}
      />
      <ul className={styles.list} id={LIST_ID}>
        {visibleEntries.map((entry) => (
          <TimelineRow entry={entry} isLiftedOnHover={!isCompact} key={entry.id} />
        ))}
      </ul>
      {isCollapsible && (
        <div>
          <button
            aria-controls={LIST_ID}
            aria-expanded={isExpanded}
            className={styles.toggle}
            onClick={() => {
              setIsExpanded(!isExpanded);
            }}
            type="button"
          >
            {isExpanded
              ? t("where_ive_been_show_less")
              : t("where_ive_been_show_more", { count: hiddenCount })}
          </button>
        </div>
      )}
    </section>
  );
}

export default WhereIveBeenSection;
