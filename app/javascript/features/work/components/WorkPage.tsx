import { useRef } from "react";

import PageQueryState from "~/components/PageQueryState/PageQueryState";
import { useWorkQuery } from "~/features/work/api/work.queries";
import CaseStudyCard from "~/features/work/components/CaseStudyCard";
import styles from "~/features/work/components/WorkPage.module.css";
import useCoveredProgress from "~/features/work/hooks/useCoveredProgress";
import { useUi } from "~/lib/ui";
import type { Work } from "~/types/contracts";

interface CaseStudyStackProps {
  work: Work;
}

const FOOTER_ID = "contact";

function CaseStudyStack({ work }: CaseStudyStackProps) {
  const t = useUi();
  const stackRef = useRef<HTMLDivElement>(null);
  useCoveredProgress(stackRef, FOOTER_ID);

  return (
    <div className={styles.page}>
      <section aria-labelledby="work-heading" className={styles.header}>
        <h1 className={styles.heading} id="work-heading">
          {t("work_heading")}
        </h1>
        <p className={styles.intro}>{work.header.intro}</p>
      </section>
      <div className={styles.stack} ref={stackRef}>
        {work.case_studies.map((caseStudy, index) => (
          <CaseStudyCard caseStudy={caseStudy} index={index} key={caseStudy.id} />
        ))}
      </div>
    </div>
  );
}

function WorkPage() {
  const workQuery = useWorkQuery();

  return (
    <PageQueryState query={workQuery}>
      {({ work }) => <CaseStudyStack work={work} />}
    </PageQueryState>
  );
}

export default WorkPage;
