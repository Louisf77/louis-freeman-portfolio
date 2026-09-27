import styles from "~/features/home/components/ExperienceSection.module.css";
import ExperienceDeck from "~/features/home/components/ExperienceDeck";
import ExperienceSwipeDeck from "~/features/home/components/ExperienceSwipeDeck";
import useMediaQuery, { COMPACT_MEDIA_QUERY } from "~/hooks/useMediaQuery";
import type { ExperienceSection as ExperienceSectionContent } from "~/types/contracts";

interface ExperienceSectionProps {
  experience: ExperienceSectionContent;
}

const SECTION_ID = "experience";
const HEADING_ID = `${SECTION_ID}-title`;

function ExperienceSection({ experience }: ExperienceSectionProps) {
  const isCompact = useMediaQuery(COMPACT_MEDIA_QUERY);
  if (experience.experiences.length === 0) return null;

  const Deck = isCompact ? ExperienceSwipeDeck : ExperienceDeck;

  return (
    <section aria-labelledby={HEADING_ID} className={styles.section} id={SECTION_ID}>
      <Deck experiences={experience.experiences} headingId={HEADING_ID} />
    </section>
  );
}

export default ExperienceSection;
