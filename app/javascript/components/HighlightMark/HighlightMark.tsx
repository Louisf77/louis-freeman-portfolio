import type { ReactNode } from "react";

import styles from "~/components/HighlightMark/HighlightMark.module.css";

interface HighlightMarkProps {
  children: ReactNode;
}

function HighlightMark({ children }: HighlightMarkProps) {
  return <mark className={styles.mark}>{children}</mark>;
}

export default HighlightMark;
