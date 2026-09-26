import PlaceholderSection from "~/components/PlaceholderSection/PlaceholderSection";
import { useUi } from "~/lib/ui";
import type { SelectedWorkSection as SelectedWorkSectionContent } from "~/types/contracts";

interface SelectedWorkSectionProps {
  selectedWork: SelectedWorkSectionContent;
}

function SelectedWorkSection({ selectedWork }: SelectedWorkSectionProps) {
  const t = useUi();
  if (selectedWork.case_studies.length === 0) return null;

  return <PlaceholderSection heading={t("selected_work_heading")} headingLevel={2} id="work" />;
}

export default SelectedWorkSection;
