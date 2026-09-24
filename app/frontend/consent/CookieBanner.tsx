import { useEffect, useId, useRef, useState } from "react";

import { useConsent } from "~/consent/ConsentProvider";
import styles from "~/consent/CookieBanner.module.css";

export interface CookieBannerCopy {
  acceptAll: string;
  alwaysOn: string;
  analyticsDescription: string;
  analyticsLabel: string;
  body: string;
  manageChoices: string;
  necessaryDescription: string;
  necessaryLabel: string;
  rejectAll: string;
  saveChoices: string;
  title: string;
}

interface CookieBannerProps {
  copy: CookieBannerCopy;
}

const DISMISS_KEY = "Escape";

function CookieBanner({ copy }: CookieBannerProps) {
  const { acceptAll, choice, dismiss, isBannerOpen, isDecided, rejectAll, save } = useConsent();
  const [isManaging, setIsManaging] = useState(false);
  const [isAnalyticsChecked, setIsAnalyticsChecked] = useState(choice.analytics);
  const bannerRef = useRef<HTMLElement>(null);
  const idPrefix = useId();
  const titleId = `${idPrefix}-title`;

  useEffect(() => {
    if (!isBannerOpen) return;

    setIsManaging(false);
    setIsAnalyticsChecked(choice.analytics);
    if (isDecided) bannerRef.current?.focus();
  }, [choice.analytics, isBannerOpen, isDecided]);

  useEffect(() => {
    if (!isBannerOpen) return;

    function dismissOnEscape(event: KeyboardEvent) {
      if (event.key === DISMISS_KEY) dismiss();
    }

    document.addEventListener("keydown", dismissOnEscape);
    return () => {
      document.removeEventListener("keydown", dismissOnEscape);
    };
  }, [dismiss, isBannerOpen]);

  if (!isBannerOpen) return null;

  return (
    <section aria-labelledby={titleId} className={styles.banner} ref={bannerRef} tabIndex={-1}>
      <h2 className={styles.title} id={titleId}>
        {copy.title}
      </h2>
      <p className={styles.body}>{copy.body}</p>
      {isManaging && (
        <fieldset className={styles.categories}>
          <div className={styles.category}>
            <input
              aria-describedby={`${idPrefix}-necessary-description`}
              checked
              disabled
              id={`${idPrefix}-necessary`}
              type="checkbox"
            />
            <label htmlFor={`${idPrefix}-necessary`}>{copy.necessaryLabel}</label>
            <p className={styles.categoryDescription} id={`${idPrefix}-necessary-description`}>
              {copy.alwaysOn}. {copy.necessaryDescription}
            </p>
          </div>
          <div className={styles.category}>
            <input
              aria-describedby={`${idPrefix}-analytics-description`}
              checked={isAnalyticsChecked}
              id={`${idPrefix}-analytics`}
              onChange={(event) => {
                setIsAnalyticsChecked(event.target.checked);
              }}
              type="checkbox"
            />
            <label htmlFor={`${idPrefix}-analytics`}>{copy.analyticsLabel}</label>
            <p className={styles.categoryDescription} id={`${idPrefix}-analytics-description`}>
              {copy.analyticsDescription}
            </p>
          </div>
        </fieldset>
      )}
      <div className={styles.actions}>
        <button className={styles.choiceButton} onClick={rejectAll} type="button">
          {copy.rejectAll}
        </button>
        <button className={styles.choiceButton} onClick={acceptAll} type="button">
          {copy.acceptAll}
        </button>
        {isManaging ? (
          <button
            className={styles.secondaryButton}
            onClick={() => {
              save({ analytics: isAnalyticsChecked });
            }}
            type="button"
          >
            {copy.saveChoices}
          </button>
        ) : (
          <button
            className={styles.secondaryButton}
            onClick={() => {
              setIsManaging(true);
            }}
            type="button"
          >
            {copy.manageChoices}
          </button>
        )}
      </div>
    </section>
  );
}

export default CookieBanner;
