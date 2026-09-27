import styles from "~/features/home/components/CaseStudyMetric.module.css";
import { useUi } from "~/lib/ui";

interface CaseStudyMetricProps {
  metric: string | null;
}

function CaseStudyMetric({ metric }: CaseStudyMetricProps) {
  const t = useUi();
  if (metric === null) return null;

  return (
    <div className={styles.metric}>
      <span className={styles.label}>{t("selected_work_metric_label")}</span>
      <span className={styles.value}>{metric}</span>
    </div>
  );
}

export default CaseStudyMetric;
