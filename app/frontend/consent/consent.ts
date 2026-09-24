declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type ConsentCategory = "analytics";

export type ConsentChoice = Record<ConsentCategory, boolean>;

export interface ConsentSnapshot {
  choice: ConsentChoice;
  isBannerOpen: boolean;
  isDecided: boolean;
}

export interface ConsentStore {
  acceptAll: () => void;
  dismiss: () => void;
  getSnapshot: () => ConsentSnapshot;
  has: (category: ConsentCategory) => boolean;
  onChange: (listener: (choice: ConsentChoice) => void) => () => void;
  open: () => void;
  rejectAll: () => void;
  save: (choice: ConsentChoice) => void;
  subscribe: (listener: () => void) => () => void;
}

type StoredConsent = ConsentChoice & {
  updated_at: string;
  version: number;
};

export const CONSENT_COOKIE_NAME = "cookie_consent";
export const CONSENT_VERSION = 1;

const CONSENT_MAX_AGE_SECONDS = 15_724_800;
const HTTPS_PROTOCOL = "https:";
const DENIED_CHOICE: ConsentChoice = { analytics: false };
const GRANTED_CHOICE: ConsentChoice = { analytics: true };
const CONSENT_MODE_DENIED = "denied";
const CONSENT_MODE_GRANTED = "granted";

function isStoredConsent(value: unknown): value is StoredConsent {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Partial<StoredConsent>;
  return typeof candidate.analytics === "boolean" && candidate.version === CONSENT_VERSION;
}

function readStoredConsent(): StoredConsent | null {
  const prefix = `${CONSENT_COOKIE_NAME}=`;
  const entry = document.cookie.split("; ").find((cookie) => cookie.startsWith(prefix));
  if (!entry) return null;

  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(entry.slice(prefix.length)));
    return isStoredConsent(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeStoredConsent(choice: ConsentChoice) {
  const stored: StoredConsent = {
    analytics: choice.analytics,
    updated_at: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  const attributes = [
    `${CONSENT_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(stored))}`,
    "path=/",
    `max-age=${String(CONSENT_MAX_AGE_SECONDS)}`,
    "SameSite=Lax",
  ];
  if (window.location.protocol === HTTPS_PROTOCOL) attributes.push("Secure");

  document.cookie = attributes.join("; ");
}

function updateConsentMode(choice: ConsentChoice) {
  window.gtag?.("consent", "update", {
    analytics_storage: choice.analytics ? CONSENT_MODE_GRANTED : CONSENT_MODE_DENIED,
  });
}

export function createConsentStore(): ConsentStore {
  const stored = readStoredConsent();
  let snapshot: ConsentSnapshot = {
    choice: stored ? { analytics: stored.analytics } : DENIED_CHOICE,
    isBannerOpen: !stored,
    isDecided: Boolean(stored),
  };
  const snapshotListeners = new Set<() => void>();
  const changeListeners = new Set<(choice: ConsentChoice) => void>();

  function setSnapshot(next: ConsentSnapshot) {
    snapshot = next;
    snapshotListeners.forEach((listener) => {
      listener();
    });
  }

  function save(choice: ConsentChoice) {
    writeStoredConsent(choice);
    updateConsentMode(choice);
    setSnapshot({ choice, isBannerOpen: false, isDecided: true });
    changeListeners.forEach((listener) => {
      listener(choice);
    });
  }

  return {
    acceptAll: () => {
      save(GRANTED_CHOICE);
    },
    dismiss: () => {
      if (!snapshot.isDecided) {
        save(DENIED_CHOICE);
        return;
      }
      setSnapshot({ ...snapshot, isBannerOpen: false });
    },
    getSnapshot: () => snapshot,
    has: (category) => snapshot.choice[category],
    onChange: (listener) => {
      changeListeners.add(listener);
      return () => changeListeners.delete(listener);
    },
    open: () => {
      setSnapshot({ ...snapshot, isBannerOpen: true });
    },
    rejectAll: () => {
      save(DENIED_CHOICE);
    },
    save,
    subscribe: (listener) => {
      snapshotListeners.add(listener);
      return () => snapshotListeners.delete(listener);
    },
  };
}

export const consent = createConsentStore();
