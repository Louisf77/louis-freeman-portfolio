import type { CSSProperties } from "react";

import Button from "~/components/Button/Button";
import CaseStudyDiagram from "~/components/diagrams/CaseStudyDiagram";
import { MIN_DIAGRAM_SCALE } from "~/components/diagrams/DiagramFrame";
import CaseStudyMetric from "~/features/home/components/CaseStudyMetric";
import CaseStudyTags from "~/features/home/components/CaseStudyTags";
import styles from "~/features/home/components/WorkStackCard.module.css";
import { caseStudyLandingState, track } from "~/lib/analytics";
import { work_path } from "~/lib/routes";
import { useUi } from "~/lib/ui";
import type { CaseStudy } from "~/types/contracts";

interface WorkStackCardProps {
  caseStudy: CaseStudy;
  stackIndex: number;
}

const ARROW = "→";

function WorkStackCard({ caseStudy, stackIndex }: WorkStackCardProps) {
  const t = useUi();
  const stackStyle = { "--stack-index": stackIndex } as CSSProperties;

  return (
    <article className={styles.card} style={stackStyle}>
      <div className={styles.visual}>
        <CaseStudyDiagram diagramKey={caseStudy.diagram_key} scale={MIN_DIAGRAM_SCALE} />
      </div>
      <div className={styles.details}>
        <p className={styles.meta}>
          <span>{caseStudy.number}</span>
          <span>{caseStudy.years_label}</span>
        </p>
        <h3 className={styles.title}>{caseStudy.title}</h3>
        <p className={styles.headline}>{caseStudy.headline}</p>
        <CaseStudyTags tags={caseStudy.tags} />
        <CaseStudyMetric metric={caseStudy.metric} />
        <Button
          className={styles.readLink}
          icon={ARROW}
          onClick={() => {
            track("case_study_view", { case_study_slug: caseStudy.slug, source: "home_link" });
          }}
          state={caseStudyLandingState(caseStudy.slug)}
          to={work_path({ anchor: caseStudy.slug })}
          variant="ghost"
        >
          {t("selected_work_read_case_study")}
        </Button>
      </div>
    </article>
  );
}

export default WorkStackCard;
