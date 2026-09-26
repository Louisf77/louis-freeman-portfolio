import Button from "~/components/Button/Button";
import styles from "~/components/SectionLoadError/SectionLoadError.module.css";
import { useUi } from "~/lib/ui";

interface SectionLoadErrorProps {
  detail?: string;
  isRetrying: boolean;
  onRetry: () => void;
}

function SectionLoadError({ detail, isRetrying, onRetry }: SectionLoadErrorProps) {
  const t = useUi();

  return (
    <div className={styles.panel} role="alert">
      <p className={styles.title}>{t("page_load_error")}</p>
      {detail && <p className={styles.detail}>{detail}</p>}
      <Button isDisabled={isRetrying} onClick={onRetry} size="small" variant="primary">
        {isRetrying ? t("retrying") : t("retry")}
      </Button>
    </div>
  );
}

export default SectionLoadError;
