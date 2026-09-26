import PlaceholderSection from "~/components/PlaceholderSection/PlaceholderSection";
import { useUi } from "~/lib/ui";
import type { ExperienceSection as ExperienceSectionContent } from "~/types/contracts";

interface ExperienceSectionProps {
  experience: ExperienceSectionContent;
}

function ExperienceSection({ experience }: ExperienceSectionProps) {
  const t = useUi();
  if (experience.experiences.length === 0) return null;

  return <PlaceholderSection heading={t("experience_heading")} headingLevel={2} id="experience" />;
}

export default ExperienceSection;
