import PlaceholderSection from "~/components/PlaceholderSection/PlaceholderSection";
import type { HeroSection as HeroSectionContent } from "~/types/contracts";

interface HeroSectionProps {
  hero: HeroSectionContent;
}

function HeroSection({ hero }: HeroSectionProps) {
  const firstGreeting = hero.greetings[0]?.text ?? "";

  return (
    <PlaceholderSection
      heading={`${hero.greeting_prefix}${firstGreeting}`}
      headingLevel={1}
      id="hero"
    />
  );
}

export default HeroSection;
