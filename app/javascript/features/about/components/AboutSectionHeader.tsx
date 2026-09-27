import styles from "~/features/about/components/AboutSectionHeader.module.css";

interface AboutSectionHeaderProps {
  heading: string;
  headingId: string;
  note?: string;
}

function AboutSectionHeader({ heading, headingId, note }: AboutSectionHeaderProps) {
  return (
    <div className={styles.header}>
      <h2 className={styles.heading} id={headingId}>
        {heading}
      </h2>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}

export default AboutSectionHeader;
