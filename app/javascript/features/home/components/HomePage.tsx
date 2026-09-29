import PageQueryState from "~/components/PageQueryState/PageQueryState";
import { useHomeQuery } from "~/features/home/api/home.queries";
import CapabilitiesSection from "~/features/home/components/CapabilitiesSection";
import ExperienceSection from "~/features/home/components/ExperienceSection";
import HeroSection from "~/features/home/components/HeroSection";
import SectionStack from "~/features/home/components/SectionStack";
import SelectedWorkSection from "~/features/home/components/SelectedWorkSection";
import { useIsWorkPublished } from "~/lib/api/profile.queries";

const FOOTER_ID = "contact";

function HomePage() {
  const homeQuery = useHomeQuery();
  const isWorkPublished = useIsWorkPublished();

  return (
    <PageQueryState query={homeQuery}>
      {({ home }) => (
        <SectionStack followerId={FOOTER_ID} lead={<HeroSection hero={home.hero} />}>
          <ExperienceSection experience={home.experience} />
          <SelectedWorkSection
            isWorkPublished={isWorkPublished}
            selectedWork={home.selected_work}
          />
          <CapabilitiesSection capabilities={home.capabilities} />
        </SectionStack>
      )}
    </PageQueryState>
  );
}

export default HomePage;
