import { useEffect, useId, useRef, useState } from "react";

import type { ConsentChoice } from "~/consent/consent";
import { useConsent } from "~/consent/ConsentProvider";
import styles from "~/consent/CookieBanner.module.css";

export interface CookieBannerCopy {
  acceptAnalytics: string;
  acceptedMessage: string;
  alwaysOn: string;
  analyticsDescription: string;
  analyticsIntro: string;
  analyticsLabel: string;
  changeSettings: string;
  changeSettingsLink: string;
  essentialIntro: string;
  hide: string;
  necessaryDescription: string;
  necessaryLabel: string;
  rejectAnalytics: string;
  rejectedMessage: string;
  saveChoices: string;
  title: string;
  viewCookies: string;
}

interface CookieBannerProps {
  copy: CookieBannerCopy;
}

type BannerView = "confirmation" | "manage" | "question";

const DISMISS_KEY = "Escape";
const LINK_PLACEHOLDER = "%{link}";

function CookieBanner({ copy }: CookieBannerProps) {
  const { acceptAll, choice, dismiss, isBannerOpen, isDecided, open, rejectAll, save } =
    useConsent();
  const [view, setView] = useState<BannerView>("question");
  const [confirmedChoice, setConfirmedChoice] = useState<ConsentChoice>(choice);
  const [isAnalyticsChecked, setIsAnalyticsChecked] = useState(choice.analytics);
  const viewOnOpenRef = useRef<BannerView>("question");
  const bannerRef = useRef<HTMLElement>(null);
  const confirmationRef = useRef<HTMLParagraphElement>(null);
  const idPrefix = useId();
  const titleId = `${idPrefix}-title`;
  const isVisible = isBannerOpen || view === "confirmation";

  useEffect(() => {
    if (!isBannerOpen) return;

    setView(viewOnOpenRef.current);
    viewOnOpenRef.current = "question";
    setIsAnalyticsChecked(choice.analytics);
    if (isDecided) bannerRef.current?.focus();
  }, [choice.analytics, isBannerOpen, isDecided]);

  useEffect(() => {
    if (view === "confirmation") confirmationRef.current?.focus();
  }, [view]);

  useEffect(() => {
    if (!isVisible) return;

    function dismissOnEscape(event: KeyboardEvent) {
      if (event.key !== DISMISS_KEY) return;
      if (view === "confirmation") {
        setView("question");
        return;
      }
      dismiss();
    }

    document.addEventListener("keydown", dismissOnEscape);
    return () => {
      document.removeEventListener("keydown", dismissOnEscape);
    };
  }, [dismiss, isVisible, view]);

  if (!isVisible) return null;

  function confirm(savedChoice: ConsentChoice) {
    setConfirmedChoice(savedChoice);
    setView("confirmation");
  }

  function openSettings() {
    viewOnOpenRef.current = "manage";
    setView("manage");
    open();
  }

  const confirmationMessage = confirmedChoice.analytics
    ? copy.acceptedMessage
    : copy.rejectedMessage;
  const [changeSettingsBefore = "", changeSettingsAfter = ""] =
    copy.changeSettings.split(LINK_PLACEHOLDER);

  return (
    <section aria-labelledby={titleId} className={styles.banner} ref={bannerRef} tabIndex={-1}>
      <h2 className={styles.title} id={titleId}>
        {copy.title}
      </h2>
      {view === "question" && (
        <>
          <p className={styles.body}>{copy.essentialIntro}</p>
          <p className={styles.body}>{copy.analyticsIntro}</p>
          <div className={styles.actions}>
            <button
              className={styles.choiceButton}
              onClick={() => {
                acceptAll();
                confirm({ analytics: true });
              }}
              type="button"
            >
              {copy.acceptAnalytics}
            </button>
            <button
              className={styles.choiceButton}
              onClick={() => {
                rejectAll();
                confirm({ analytics: false });
              }}
              type="button"
            >
              {copy.rejectAnalytics}
            </button>
            <button
              className={styles.linkButton}
              onClick={() => {
                setView("manage");
              }}
              type="button"
            >
              {copy.viewCookies}
            </button>
          </div>
        </>
      )}
      {view === "manage" && (
        <>
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
          <div className={styles.actions}>
            <button
              className={styles.choiceButton}
              onClick={() => {
                const savedChoice = { analytics: isAnalyticsChecked };
                save(savedChoice);
                confirm(savedChoice);
              }}
              type="button"
            >
              {copy.saveChoices}
            </button>
          </div>
        </>
      )}
      {view === "confirmation" && (
        <>
          <p className={styles.body} ref={confirmationRef} role="status" tabIndex={-1}>
            {confirmationMessage} {changeSettingsBefore}
            <button className={styles.inlineLinkButton} onClick={openSettings} type="button">
              {copy.changeSettingsLink}
            </button>
            {changeSettingsAfter}
          </p>
          <div className={styles.actions}>
            <button
              className={styles.choiceButton}
              onClick={() => {
                setView("question");
              }}
              type="button"
            >
              {copy.hide}
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default CookieBanner;
