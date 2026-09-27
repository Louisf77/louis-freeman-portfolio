import { useMemo } from "react";

import styles from "~/features/home/components/HeroSection.module.css";
import HeroVideo from "~/features/home/components/HeroVideo";
import TypedGreeting from "~/features/home/components/TypedGreeting";
import { useUi } from "~/lib/ui";
import type { HeroSection as HeroSectionContent } from "~/types/contracts";

interface HeroSectionProps {
  hero: HeroSectionContent;
}

const HEADING_ID = "hero-title";
const NEXT_SECTION_ANCHOR = "#experience";

function HeroSection({ hero }: HeroSectionProps) {
  const t = useUi();
  const endings = useMemo(() => hero.greetings.map((greeting) => greeting.text), [hero.greetings]);

  return (
    <section aria-labelledby={HEADING_ID} className={styles.hero} id="hero">
      <HeroVideo />
      <div className={styles.greeting}>
        <TypedGreeting endings={endings} headingId={HEADING_ID} prefix={hero.greeting_prefix} />
      </div>
      <div className={styles.foot}>
        <p className={styles.tagline}>{hero.tagline}</p>
        <a className={styles.scrollCue} href={NEXT_SECTION_ANCHOR}>
          <span>{t("hero_scroll_cue")}</span>
          <span aria-hidden="true" className={styles.cueLine} />
        </a>
      </div>
    </section>
  );
}

export default HeroSection;
