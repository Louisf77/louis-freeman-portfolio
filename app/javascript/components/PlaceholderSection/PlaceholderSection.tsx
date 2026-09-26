import styles from "~/components/PlaceholderSection/PlaceholderSection.module.css";

type HeadingLevel = 1 | 2;

interface PlaceholderSectionProps {
  heading: string;
  headingLevel: HeadingLevel;
  id: string;
}

const HEADING_CLASS: Record<HeadingLevel, string | undefined> = {
  1: styles.pageHeading,
  2: styles.sectionHeading,
};

function PlaceholderSection({ heading, headingLevel, id }: PlaceholderSectionProps) {
  const HeadingElement = headingLevel === 1 ? "h1" : "h2";
  const headingId = `${id}-title`;

  return (
    <section aria-labelledby={headingId} className={styles.section} id={id}>
      <HeadingElement className={HEADING_CLASS[headingLevel]} id={headingId}>
        {heading}
      </HeadingElement>
    </section>
  );
}

export default PlaceholderSection;
