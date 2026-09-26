import { Outlet, useLocation } from "react-router";

import styles from "~/app/Layout.module.css";
import PageEnter from "~/app/PageEnter";
import ScrollToLocation from "~/app/ScrollToLocation";
import Footer from "~/components/Footer/Footer";
import Nav from "~/components/Nav/Nav";
import SkipLink from "~/components/SkipLink/SkipLink";
import { useProfileQuery } from "~/lib/api/profile.queries";

const MAIN_ID = "main";

function Layout() {
  const { pathname } = useLocation();
  const { data } = useProfileQuery();
  const profile = data?.profile;

  return (
    <div className={styles.page} id="top">
      <SkipLink targetId={MAIN_ID} />
      <Nav profile={profile} />
      <PageEnter key={pathname}>
        <main className={styles.main} id={MAIN_ID} tabIndex={-1}>
          <Outlet />
        </main>
        <Footer profile={profile} />
      </PageEnter>
      <ScrollToLocation />
    </div>
  );
}

export default Layout;
