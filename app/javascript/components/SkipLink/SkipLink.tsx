import styles from "~/components/SkipLink/SkipLink.module.css";
import { useUi } from "~/lib/ui";

interface SkipLinkProps {
  targetId: string;
}

function SkipLink({ targetId }: SkipLinkProps) {
  const t = useUi();

  return (
    <a className={styles.skip} href={`#${targetId}`}>
      {t("skip_to_content")}
    </a>
  );
}

export default SkipLink;
