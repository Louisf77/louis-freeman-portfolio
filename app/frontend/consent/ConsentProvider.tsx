import { createContext, type ReactNode, useContext, useMemo, useSyncExternalStore } from "react";

import {
  type ConsentCategory,
  type ConsentChoice,
  consent,
  type ConsentStore,
} from "~/consent/consent";

export interface ConsentContextValue {
  acceptAll: () => void;
  choice: ConsentChoice;
  dismiss: () => void;
  has: (category: ConsentCategory) => boolean;
  isBannerOpen: boolean;
  isDecided: boolean;
  open: () => void;
  rejectAll: () => void;
  save: (choice: ConsentChoice) => void;
}

interface ConsentProviderProps {
  children: ReactNode;
  store?: ConsentStore;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent(): ConsentContextValue {
  const value = useContext(ConsentContext);
  if (!value) throw new Error("useConsent must be used inside a ConsentProvider");

  return value;
}

function ConsentProvider({ children, store = consent }: ConsentProviderProps) {
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot);

  const value = useMemo<ConsentContextValue>(
    () => ({
      acceptAll: store.acceptAll,
      choice: snapshot.choice,
      dismiss: store.dismiss,
      has: (category) => snapshot.choice[category],
      isBannerOpen: snapshot.isBannerOpen,
      isDecided: snapshot.isDecided,
      open: store.open,
      rejectAll: store.rejectAll,
      save: store.save,
    }),
    [snapshot, store],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export default ConsentProvider;
