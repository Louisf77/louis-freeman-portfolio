import Card from "~/components/Card/Card";
import Tag from "~/components/Tag/Tag";
import styles from "~/features/home/components/WorkComingSoonCard.module.css";
import { useUi } from "~/lib/ui";

function WorkComingSoonCard() {
  const t = useUi();

  return (
    <Card className={styles.card} surface="surface-2">
      <Tag as="span" variant="dates">
        {t("selected_work_coming_soon_label")}
      </Tag>
      <p className={styles.body}>{t("selected_work_coming_soon_body")}</p>
    </Card>
  );
}

export default WorkComingSoonCard;
