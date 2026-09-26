import { useLocation } from "react-router";

import logoMark from "~/assets/logo-mark.png";
import ExternalLink from "~/components/ExternalLink/ExternalLink";
import styles from "~/components/Footer/Footer.module.css";
import PrivacyNote from "~/components/Footer/PrivacyNote";
import useMediaQuery, { COMPACT_MEDIA_QUERY } from "~/hooks/useMediaQuery";
import classNames from "~/lib/classNames";
import { useUi } from "~/lib/ui";
import type { Profile } from "~/types/contracts";

interface FooterProps {
  profile: Profile | undefined;
}

const HOME_PATH = "/";
const TOP_ANCHOR = "#top";

function Footer({ profile }: FooterProps) {
  const t = useUi();
  const { pathname } = useLocation();
  const isCompact = useMediaQuery(COMPACT_MEDIA_QUERY);
  const isHome = pathname === HOME_PATH;

  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.connect}>
        <h2 className={classNames(styles.heading, isHome && styles.headingHome)}>
          {t("footer_heading_lead")}
          <span className={styles.accent}>{t("footer_heading_accent")}</span>
        </h2>
        {profile && (
          <div className={styles.contactRow}>
            <div className={styles.contactLinks}>
              <a className={styles.mail} href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <div className={styles.pills}>
                <ExternalLink className={styles.pill} href={profile.linkedin_url}>
                  {t("contact_linkedin")}
                  <span aria-hidden="true">↗</span>
                </ExternalLink>
                <ExternalLink className={styles.pill} href={profile.github_url}>
                  {t("contact_github")}
                  <span aria-hidden="true">↗</span>
                </ExternalLink>
              </div>
            </div>
            <p className={styles.blurb}>{profile.footer_blurb}</p>
          </div>
        )}
      </div>
      <div className={styles.bottomRow}>
        <span className={styles.signature}>
          <img alt="" className={styles.logo} src={logoMark} />
          {profile && t("copyright", { name: profile.name, year: new Date().getFullYear() })}
        </span>
        <span className={styles.bottomLinks}>
          <PrivacyNote />
          <a className={styles.bottomLink} href={TOP_ANCHOR}>
            {isCompact ? t("back_to_top_short") : t("back_to_top")}
          </a>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
