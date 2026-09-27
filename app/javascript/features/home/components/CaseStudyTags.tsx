import Tag from "~/components/Tag/Tag";
import styles from "~/features/home/components/CaseStudyTags.module.css";
import { useUi } from "~/lib/ui";

interface CaseStudyTagsProps {
  tags: string[];
}

function CaseStudyTags({ tags }: CaseStudyTagsProps) {
  const t = useUi();
  if (tags.length === 0) return null;

  return (
    <ul aria-label={t("selected_work_technologies")} className={styles.tags}>
      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </ul>
  );
}

export default CaseStudyTags;
