import { createContext, useCallback, useContext, type ReactNode } from "react";

import type { UiStrings } from "~/types/contracts";

type Interpolations = Record<string, number | string>;
type Translate = (key: string, interpolations?: Interpolations) => string;

interface UiProviderProps {
  children: ReactNode;
  strings: UiStrings;
}

const INTERPOLATION_PATTERN = /%\{(\w+)\}/g;

const UiContext = createContext<UiStrings>({});

export function UiProvider({ children, strings }: UiProviderProps) {
  return <UiContext value={strings}>{children}</UiContext>;
}

export function useUi(): Translate {
  const strings = useContext(UiContext);

  return useCallback(
    (key, interpolations = {}) =>
      (strings[key] ?? key).replace(INTERPOLATION_PATTERN, (placeholder, name: string) =>
        String(interpolations[name] ?? placeholder),
      ),
    [strings],
  );
}
