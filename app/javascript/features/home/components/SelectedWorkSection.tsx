import { useState } from "react";

import Button from "~/components/Button/Button";
import styles from "~/features/home/components/SelectedWorkSection.module.css";
import WorkAccordion from "~/features/home/components/WorkAccordion";
import WorkStackMobile from "~/features/home/components/WorkStackMobile";
import useMediaQuery, { COMPACT_MEDIA_QUERY } from "~/hooks/useMediaQuery";
import { work_path } from "~/lib/routes";
import { useUi } from "~/lib/ui";
import type { SelectedWorkSection as SelectedWorkSectionContent } from "~/types/contracts";

interface SelectedWorkSectionProps {
  selectedWork: SelectedWorkSectionContent;
}

const SECTION_ID = "work";
const HEADING_ID = `${SECTION_ID}-title`;
const ARROW = "→";

function SelectedWorkSection({ selectedWork }: SelectedWorkSectionProps) {
  const t = useUi();
  const isCompact = useMediaQuery(COMPACT_MEDIA_QUERY);
  const [isPointerGone, setIsPointerGone] = useState(false);
  if (selectedWork.case_studies.length === 0) return null;

  return (
    <section
      aria-labelledby={HEADING_ID}
      className={styles.section}
      id={SECTION_ID}
      onMouseLeave={() => {
        setIsPointerGone(true);
      }}
    >
      <div className={styles.header}>
        <h2 className={styles.title} id={HEADING_ID}>
          {t("selected_work_heading")}
        </h2>
        <p className={styles.intro}>{selectedWork.intro}</p>
      </div>
      {isCompact ? (
        <WorkStackMobile caseStudies={selectedWork.case_studies} />
      ) : (
        <WorkAccordion caseStudies={selectedWork.case_studies} isAutoplayAllowed={!isPointerGone} />
      )}
      <div className={styles.footer}>
        <Button className={styles.viewAll} icon={ARROW} to={work_path()} variant="ghost">
          {t("selected_work_view_all")}
        </Button>
      </div>
    </section>
  );
}

export default SelectedWorkSection;
