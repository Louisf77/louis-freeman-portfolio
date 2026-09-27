import type { KeyboardEvent, Ref } from "react";

import Button from "~/components/Button/Button";
import CaseStudyDiagram from "~/components/diagrams/CaseStudyDiagram";
import CaseStudyMetric from "~/features/home/components/CaseStudyMetric";
import CaseStudyTags from "~/features/home/components/CaseStudyTags";
import styles from "~/features/home/components/WorkAccordionPanel.module.css";
import classNames from "~/lib/classNames";
import { work_path } from "~/lib/routes";
import { useUi } from "~/lib/ui";
import type { CaseStudy } from "~/types/contracts";

interface WorkAccordionPanelProps {
  caseStudy: CaseStudy;
  diagramScale: number;
  isOpen: boolean;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onOpen: () => void;
  toggleRef: Ref<HTMLButtonElement>;
}

const ARROW = "→";
const META_SEPARATOR = " · ";

function WorkAccordionPanel({
  caseStudy,
  diagramScale,
  isOpen,
  onKeyDown,
  onOpen,
  toggleRef,
}: WorkAccordionPanelProps) {
  const t = useUi();
  const bodyId = `work-panel-${caseStudy.slug}`;
  const meta = [caseStudy.number, caseStudy.years_label, caseStudy.role].join(META_SEPARATOR);

  return (
    <article className={classNames(styles.panel, isOpen && styles.open)} onMouseEnter={onOpen}>
      <button
        aria-controls={bodyId}
        aria-expanded={isOpen}
        aria-label={caseStudy.title}
        className={styles.toggle}
        onClick={onOpen}
        onFocus={onOpen}
        onKeyDown={onKeyDown}
        ref={toggleRef}
        type="button"
      />
      <span aria-hidden="true" className={styles.number}>
        {caseStudy.number}
      </span>
      <div aria-hidden="true" className={styles.verticalTitle}>
        <span>{caseStudy.title}</span>
      </div>
      <div className={styles.body} id={bodyId} inert={!isOpen}>
        <div className={styles.visual}>
          <CaseStudyDiagram diagramKey={caseStudy.diagram_key} scale={diagramScale} />
        </div>
        <div className={styles.footer}>
          <div className={styles.details}>
            <p className={styles.meta}>{meta}</p>
            <h3 className={styles.title}>{caseStudy.title}</h3>
            <p className={styles.headline}>{caseStudy.headline}</p>
            <CaseStudyTags tags={caseStudy.tags} />
            <CaseStudyMetric metric={caseStudy.metric} />
          </div>
          <Button
            className={styles.readLink}
            icon={ARROW}
            to={work_path({ anchor: caseStudy.slug })}
            variant="ghost"
          >
            {t("selected_work_read_case_study")}
          </Button>
        </div>
      </div>
    </article>
  );
}

export default WorkAccordionPanel;
