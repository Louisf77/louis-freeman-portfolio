import Card from "~/components/Card/Card";
import styles from "~/features/about/components/TimelineRow.module.css";
import classNames from "~/lib/classNames";
import type { Experience } from "~/types/contracts";

type TimelineRowVariant = "education" | "role";

interface TimelineRowProps {
  entry: Experience;
  isLiftedOnHover: boolean;
}

const VARIANT_CLASS: Record<TimelineRowVariant, string | undefined> = {
  education: styles.education,
  role: undefined,
};

function TimelineRow({ entry, isLiftedOnHover }: TimelineRowProps) {
  const variant: TimelineRowVariant = entry.education ? "education" : "role";

  return (
    <li data-variant={variant}>
      <Card
        className={classNames(styles.row, VARIANT_CLASS[variant])}
        isLiftedOnHover={isLiftedOnHover}
      >
        <span className={styles.year}>{entry.year_label}</span>
        <span className={styles.company}>{entry.company}</span>
        <span className={styles.role}>{entry.role}</span>
        <span className={styles.dates}>{entry.dates_label}</span>
      </Card>
    </li>
  );
}

export default TimelineRow;
