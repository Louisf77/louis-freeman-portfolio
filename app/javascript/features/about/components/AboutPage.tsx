import PageQueryState from "~/components/PageQueryState/PageQueryState";
import { useAboutQuery } from "~/features/about/api/about.queries";
import ConversationIntro from "~/features/about/components/ConversationIntro";
import HobbiesSection from "~/features/about/components/HobbiesSection";
import WhereIveBeenSection from "~/features/about/components/WhereIveBeenSection";

function AboutPage() {
  const aboutQuery = useAboutQuery();

  return (
    <PageQueryState query={aboutQuery}>
      {({ about }) => (
        <>
          <ConversationIntro conversation={about.conversation} intro={about.intro} />
          <HobbiesSection hobbies={about.hobbies} />
          <WhereIveBeenSection timeline={about.timeline} />
        </>
      )}
    </PageQueryState>
  );
}

export default AboutPage;
