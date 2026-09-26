import { createContext, useContext, type ReactNode } from "react";

import type { QueryKey, QueryResponses } from "~/types/contracts";

interface BootstrapQueriesProviderProps {
  children: ReactNode;
  queries: Partial<QueryResponses>;
}

const BootstrapQueriesContext = createContext<Partial<QueryResponses>>({});

export function BootstrapQueriesProvider({ children, queries }: BootstrapQueriesProviderProps) {
  return <BootstrapQueriesContext value={queries}>{children}</BootstrapQueriesContext>;
}

export function useBootstrapQuery<K extends QueryKey>(key: K): QueryResponses[K] | undefined {
  return useContext(BootstrapQueriesContext)[key];
}
