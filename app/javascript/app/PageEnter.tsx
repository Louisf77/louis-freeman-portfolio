import type { ReactNode } from "react";

import styles from "~/app/PageEnter.module.css";

interface PageEnterProps {
  children: ReactNode;
}

function PageEnter({ children }: PageEnterProps) {
  return (
    <div className={styles.pageEnter} data-testid="page-enter">
      {children}
    </div>
  );
}

export default PageEnter;
