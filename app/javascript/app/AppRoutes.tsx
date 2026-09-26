import { Route, Routes } from "react-router";

import Layout from "~/app/Layout";
import AboutPage from "~/features/about/components/AboutPage";
import HomePage from "~/features/home/components/HomePage";
import WorkPage from "~/features/work/components/WorkPage";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<HomePage />} index />
        <Route element={<WorkPage />} path="work" />
        <Route element={<AboutPage />} path="about" />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
