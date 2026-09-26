import PlaceholderSection from "~/components/PlaceholderSection/PlaceholderSection";
import { useUi } from "~/lib/ui";
import type { HobbiesSection as HobbiesSectionContent } from "~/types/contracts";

interface HobbiesSectionProps {
  hobbies: HobbiesSectionContent;
}

function HobbiesSection({ hobbies }: HobbiesSectionProps) {
  const t = useUi();
  if (hobbies.items.length === 0) return null;

  return <PlaceholderSection heading={t("hobbies_heading")} headingLevel={2} id="out" />;
}

export default HobbiesSection;
