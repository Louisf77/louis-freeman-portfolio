import PlaceholderSection from "~/components/PlaceholderSection/PlaceholderSection";
import { useUi } from "~/lib/ui";
import type { Experience } from "~/types/contracts";

interface WhereIveBeenSectionProps {
  timeline: Experience[];
}

function WhereIveBeenSection({ timeline }: WhereIveBeenSectionProps) {
  const t = useUi();
  if (timeline.length === 0) return null;

  return (
    <PlaceholderSection heading={t("where_ive_been_heading")} headingLevel={2} id="experience" />
  );
}

export default WhereIveBeenSection;
