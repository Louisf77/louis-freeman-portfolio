import DiagramFrame from "~/components/diagrams/DiagramFrame";
import { useUi } from "~/lib/ui";
import type { CaseStudy } from "~/types/contracts";

interface CaseStudyFigureProps {
  caseStudy: CaseStudy;
  scale?: number;
}

function CaseStudyFigure({ caseStudy, scale }: CaseStudyFigureProps) {
  const t = useUi();

  return (
    <DiagramFrame
      caption={t("case_study_figure_caption", { number: caseStudy.number })}
      label={t("case_study_figure_label", { title: caseStudy.title })}
      pattern="dots"
      scale={scale}
    />
  );
}

export default CaseStudyFigure;
