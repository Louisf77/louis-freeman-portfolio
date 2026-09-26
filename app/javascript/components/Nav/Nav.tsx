import { NavLink } from "react-router";

import logoMark from "~/assets/logo-mark.png";
import ContactMenu from "~/components/Nav/ContactMenu";
import styles from "~/components/Nav/Nav.module.css";
import useScrolledPast from "~/hooks/useScrolledPast";
import classNames from "~/lib/classNames";
import { useUi } from "~/lib/ui";
import type { Profile } from "~/types/contracts";

interface NavProps {
  profile: Profile | undefined;
}

const SCROLLED_THRESHOLD_PX = 12;

function Nav({ profile }: NavProps) {
  const t = useUi();
  const isScrolled = useScrolledPast(SCROLLED_THRESHOLD_PX);

  return (
    <header className={classNames(styles.nav, isScrolled && styles.scrolled)}>
      <nav aria-label={t("nav_label")} className={styles.pill}>
        <NavLink
          aria-label={t("nav_home")}
          className={classNames(styles.item, styles.home)}
          end
          to="/"
        >
          <img alt="" className={styles.logo} src={logoMark} />
        </NavLink>
        <NavLink className={styles.item} to="/work">
          {t("nav_work")}
        </NavLink>
        <NavLink className={styles.item} to="/about">
          {t("nav_about")}
        </NavLink>
        {profile && <ContactMenu profile={profile} />}
      </nav>
    </header>
  );
}

export default Nav;
