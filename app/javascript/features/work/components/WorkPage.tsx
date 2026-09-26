import PageQueryState from "~/components/PageQueryState/PageQueryState";
import PlaceholderSection from "~/components/PlaceholderSection/PlaceholderSection";
import { useWorkQuery } from "~/features/work/api/work.queries";
import { useUi } from "~/lib/ui";

function WorkPage() {
  const t = useUi();
  const workQuery = useWorkQuery();

  return (
    <PageQueryState query={workQuery}>
      {() => <PlaceholderSection heading={t("work_heading")} headingLevel={1} id="work-header" />}
    </PageQueryState>
  );
}

export default WorkPage;
