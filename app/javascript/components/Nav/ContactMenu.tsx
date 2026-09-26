import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useLocation } from "react-router";

import styles from "~/components/Nav/Nav.module.css";
import useMediaQuery, { COMPACT_MEDIA_QUERY } from "~/hooks/useMediaQuery";
import classNames from "~/lib/classNames";
import { useUi } from "~/lib/ui";
import type { Profile } from "~/types/contracts";

interface ContactMenuProps {
  profile: Profile;
}

type ContactVariant = "dropdown" | "slide-out";

const EXTERNAL_LINK_REL = "noopener noreferrer";
const EXTERNAL_LINK_TARGET = "_blank";

const LINKS_CLASS_BY_VARIANT: Record<ContactVariant, string | undefined> = {
  dropdown: styles.dropdown,
  "slide-out": styles.slideOut,
};

function ContactMenu({ profile }: ContactMenuProps) {
  const t = useUi();
  const { pathname } = useLocation();
  const isCompact = useMediaQuery(COMPACT_MEDIA_QUERY);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const linksId = useId();
  const variant: ContactVariant = isCompact ? "dropdown" : "slide-out";

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(close, [close, pathname]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      close();
      buttonRef.current?.focus();
    };

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!isCompact) return;
      if (event.target instanceof Node && containerRef.current?.contains(event.target)) return;

      close();
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsidePointer);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
    };
  }, [close, isCompact, isOpen]);

  return (
    <span className={styles.contact} ref={containerRef}>
      <button
        aria-controls={linksId}
        aria-expanded={isOpen}
        className={classNames(styles.item, styles.contactButton)}
        onClick={() => {
          setIsOpen((isOpenNow) => !isOpenNow);
        }}
        ref={buttonRef}
        type="button"
      >
        {t("contact")}
        <span aria-hidden="true" className={styles.plus} />
      </button>
      <span
        className={classNames(LINKS_CLASS_BY_VARIANT[variant], isOpen && styles.open)}
        data-testid="contact-links"
        data-variant={variant}
        id={linksId}
        inert={!isOpen}
      >
        <a className={styles.contactLink} href={`mailto:${profile.email}`}>
          {t("contact_email")}
          <span aria-hidden="true" className={styles.emailArrow}>
            →
          </span>
        </a>
        <a
          className={styles.contactLink}
          href={profile.linkedin_url}
          rel={EXTERNAL_LINK_REL}
          target={EXTERNAL_LINK_TARGET}
        >
          {t("contact_linkedin")}
          <span aria-hidden="true">↗</span>
          <span className="visually-hidden">{t("opens_in_new_tab")}</span>
        </a>
        <a
          className={styles.contactLink}
          href={profile.github_url}
          rel={EXTERNAL_LINK_REL}
          target={EXTERNAL_LINK_TARGET}
        >
          {t("contact_github")}
          <span aria-hidden="true">↗</span>
          <span className="visually-hidden">{t("opens_in_new_tab")}</span>
        </a>
      </span>
    </span>
  );
}

export default ContactMenu;
