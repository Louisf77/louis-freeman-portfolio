import styles from "~/components/CaseStudyMetric/CaseStudyMetric.module.css";
import classNames from "~/lib/classNames";
import { useUi } from "~/lib/ui";

interface CaseStudyMetricProps {
  className?: string;
  metric: string | null;
}

function CaseStudyMetric({ className, metric }: CaseStudyMetricProps) {
  const t = useUi();
  if (metric === null) return null;

  return (
    <div className={classNames(styles.metric, className)}>
      <span className={styles.label}>{t("case_study_metric")}</span>
      <span className={styles.value}>{metric}</span>
    </div>
  );
}

export default CaseStudyMetric;
