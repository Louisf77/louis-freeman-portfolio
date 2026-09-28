import { useRef, type CSSProperties } from "react";

import CaseStudyMetric from "~/components/CaseStudyMetric/CaseStudyMetric";
import CaseStudyTags from "~/components/CaseStudyTags/CaseStudyTags";
import CaseStudyDiagram from "~/components/diagrams/CaseStudyDiagram";
import styles from "~/features/work/components/CaseStudyCard.module.css";
import useFittedDiagramScale from "~/features/work/hooks/useFittedDiagramScale";
import useTrackCaseStudyView from "~/features/work/hooks/useTrackCaseStudyView";
import { stackOffsetsFor } from "~/features/work/lib/caseStudyStack";
import classNames from "~/lib/classNames";
import { useUi } from "~/lib/ui";
import type { CaseStudy } from "~/types/contracts";

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  index: number;
  isLandingTarget?: boolean;
}

type StackParity = "even" | "odd";

const PARITY_CLASS: Record<StackParity, string | undefined> = {
  even: styles.even,
  odd: styles.odd,
};

function parityOf(index: number): StackParity {
  return index % 2 === 0 ? "even" : "odd";
}

function stackStyleFor(index: number): CSSProperties {
  const offsets = stackOffsetsFor(index);

  return {
    "--stack-top-compact": `${String(offsets.compact)}px`,
    "--stack-top-wide": `${String(offsets.wide)}px`,
    zIndex: index + 1,
  } as CSSProperties;
}

function CaseStudyCard({ caseStudy, index, isLandingTarget = false }: CaseStudyCardProps) {
  const t = useUi();
  const cardRef = useRef<HTMLElement>(null);
  const wellRef = useRef<HTMLDivElement>(null);
  const diagramScale = useFittedDiagramScale(wellRef);
  useTrackCaseStudyView(cardRef, caseStudy.slug, isLandingTarget);
  const titleId = `${caseStudy.slug}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className={classNames(styles.card, PARITY_CLASS[parityOf(index)])}
      id={caseStudy.slug}
      ref={cardRef}
      style={stackStyleFor(index)}
    >
      <div className={styles.well} ref={wellRef}>
        <div className={styles.diagram}>
          <CaseStudyDiagram diagramKey={caseStudy.diagram_key} scale={diagramScale} />
        </div>
      </div>
      <div className={styles.body}>
        <p className={styles.eyebrow}>
          <span>{caseStudy.number}</span>
          <span>{caseStudy.years_label}</span>
        </p>
        <h2 className={styles.title} id={titleId}>
          {caseStudy.title}
        </h2>
        <p className={styles.headline}>{caseStudy.headline}</p>
        <p className={styles.description}>{caseStudy.description}</p>
        <p className={styles.role}>
          <span className={styles.roleLabel}>{t("case_study_role")}</span>
          {caseStudy.role}
        </p>
        <CaseStudyTags tags={caseStudy.tags} />
        <CaseStudyMetric metric={caseStudy.metric} />
      </div>
    </article>
  );
}

export default CaseStudyCard;
