import { Route, Routes } from "react-router";

import Layout from "~/app/Layout";
import AboutPage from "~/features/about/components/AboutPage";
import HomePage from "~/features/home/components/HomePage";
import WorkPage from "~/features/work/components/WorkPage";
import { useIsWorkPublished } from "~/lib/api/profile.queries";

function AppRoutes() {
  const isWorkPublished = useIsWorkPublished();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<HomePage />} index />
        {isWorkPublished && <Route element={<WorkPage />} path="work" />}
        <Route element={<AboutPage />} path="about" />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
