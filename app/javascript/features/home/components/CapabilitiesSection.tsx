import PlaceholderSection from "~/components/PlaceholderSection/PlaceholderSection";
import type { CapabilitiesSection as CapabilitiesSectionContent } from "~/types/contracts";

interface CapabilitiesSectionProps {
  capabilities: CapabilitiesSectionContent;
}

function CapabilitiesSection({ capabilities }: CapabilitiesSectionProps) {
  return <PlaceholderSection heading={capabilities.title} headingLevel={2} id="capabilities" />;
}

export default CapabilitiesSection;
