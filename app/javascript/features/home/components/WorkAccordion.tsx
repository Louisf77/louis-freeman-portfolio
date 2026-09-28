import { useRef, useState, type KeyboardEvent } from "react";

import styles from "~/features/home/components/WorkAccordion.module.css";
import WorkAccordionPanel from "~/features/home/components/WorkAccordionPanel";
import useMediaQuery from "~/hooks/useMediaQuery";
import type { CaseStudy } from "~/types/contracts";

interface WorkAccordionProps {
  caseStudies: CaseStudy[];
}

type PanelTarget = (index: number, count: number) => number;

const MEDIUM_MEDIA_QUERY = "(max-width: 1100px)";
const DIAGRAM_SCALE = 0.8;
const DIAGRAM_SCALE_MEDIUM = 0.55;

const PANEL_TARGET_BY_KEY: Record<string, PanelTarget> = {
  ArrowDown: (index, count) => (index + 1) % count,
  ArrowLeft: (index, count) => (index - 1 + count) % count,
  ArrowRight: (index, count) => (index + 1) % count,
  ArrowUp: (index, count) => (index - 1 + count) % count,
  End: (_index, count) => count - 1,
  Home: () => 0,
};

function WorkAccordion({ caseStudies }: WorkAccordionProps) {
  const [openIndex, setOpenIndex] = useState(0);
  const isMedium = useMediaQuery(MEDIUM_MEDIA_QUERY);
  const toggleRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelCount = caseStudies.length;

  const openPanel = (index: number) => {
    setOpenIndex(index);
  };

  const focusPanelForKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const target = PANEL_TARGET_BY_KEY[event.key];
    if (!target) return;

    event.preventDefault();
    toggleRefs.current[target(index, panelCount)]?.focus();
  };

  return (
    <div className={styles.accordion}>
      {caseStudies.map((caseStudy, index) => (
        <WorkAccordionPanel
          caseStudy={caseStudy}
          diagramScale={isMedium ? DIAGRAM_SCALE_MEDIUM : DIAGRAM_SCALE}
          isOpen={index === openIndex}
          key={caseStudy.id}
          onKeyDown={(event) => {
            focusPanelForKey(event, index);
          }}
          onOpen={() => {
            openPanel(index);
          }}
          toggleRef={(toggle) => {
            toggleRefs.current[index] = toggle;
          }}
        />
      ))}
    </div>
  );
}

export default WorkAccordion;
