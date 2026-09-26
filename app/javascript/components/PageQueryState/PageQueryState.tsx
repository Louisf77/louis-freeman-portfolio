import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";

import styles from "~/components/PageQueryState/PageQueryState.module.css";
import SectionLoadError from "~/components/SectionLoadError/SectionLoadError";
import { ApiError } from "~/lib/apiClient";

interface PageQueryStateProps<T> {
  children: (data: T) => ReactNode;
  query: UseQueryResult<T>;
}

function PageQueryState<T>({ children, query }: PageQueryStateProps<T>) {
  if (query.isError) {
    return (
      <SectionLoadError
        detail={query.error instanceof ApiError ? query.error.message : undefined}
        isRetrying={query.isFetching}
        onRetry={() => {
          query.refetch().catch(() => undefined);
        }}
      />
    );
  }

  if (query.isPending) return <div aria-busy="true" className={styles.pending} />;

  return children(query.data);
}

export default PageQueryState;
