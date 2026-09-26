import { useId, useRef } from "react";

import Button from "~/components/Button/Button";
import styles from "~/components/Footer/Footer.module.css";
import { useUi } from "~/lib/ui";

const UMAMI_PRIVACY_POLICY_URL = "https://umami.is/privacy";

function PrivacyNote() {
  const t = useUi();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  return (
    <>
      <button
        className={styles.bottomLink}
        onClick={() => {
          dialogRef.current?.showModal();
        }}
        type="button"
      >
        {t("privacy_link")}
      </button>
      <dialog aria-labelledby={titleId} className={styles.privacyDialog} ref={dialogRef}>
        <h2 className={styles.privacyTitle} id={titleId}>
          {t("privacy_title")}
        </h2>
        <p className={styles.privacyBody}>{t("privacy_body")}</p>
        <a
          className={styles.privacyPolicyLink}
          href={UMAMI_PRIVACY_POLICY_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          {t("privacy_policy_link")}
          <span aria-hidden="true"> ↗</span>
          <span className="visually-hidden">{t("opens_in_new_tab")}</span>
        </a>
        <Button
          className={styles.privacyClose}
          onClick={() => {
            dialogRef.current?.close();
          }}
          size="small"
        >
          {t("close")}
        </Button>
      </dialog>
    </>
  );
}

export default PrivacyNote;
