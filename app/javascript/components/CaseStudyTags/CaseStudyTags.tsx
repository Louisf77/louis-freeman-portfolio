import styles from "~/components/CaseStudyTags/CaseStudyTags.module.css";
import Tag from "~/components/Tag/Tag";
import classNames from "~/lib/classNames";
import { useUi } from "~/lib/ui";

interface CaseStudyTagsProps {
  className?: string;
  tags: string[];
}

function CaseStudyTags({ className, tags }: CaseStudyTagsProps) {
  const t = useUi();
  if (tags.length === 0) return null;

  return (
    <ul aria-label={t("case_study_technologies")} className={classNames(styles.tags, className)}>
      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </ul>
  );
}

export default CaseStudyTags;
