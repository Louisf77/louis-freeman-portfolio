import PageQueryState from "~/components/PageQueryState/PageQueryState";
import { useHomeQuery } from "~/features/home/api/home.queries";
import CapabilitiesSection from "~/features/home/components/CapabilitiesSection";
import ExperienceSection from "~/features/home/components/ExperienceSection";
import HeroSection from "~/features/home/components/HeroSection";
import SelectedWorkSection from "~/features/home/components/SelectedWorkSection";

function HomePage() {
  const homeQuery = useHomeQuery();

  return (
    <PageQueryState query={homeQuery}>
      {({ home }) => (
        <>
          <HeroSection hero={home.hero} />
          <ExperienceSection experience={home.experience} />
          <SelectedWorkSection selectedWork={home.selected_work} />
          <CapabilitiesSection capabilities={home.capabilities} />
        </>
      )}
    </PageQueryState>
  );
}

export default HomePage;
