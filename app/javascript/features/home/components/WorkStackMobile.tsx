import styles from "~/features/home/components/WorkStackMobile.module.css";
import WorkStackCard from "~/features/home/components/WorkStackCard";
import type { CaseStudy } from "~/types/contracts";

interface WorkStackMobileProps {
  caseStudies: CaseStudy[];
}

function WorkStackMobile({ caseStudies }: WorkStackMobileProps) {
  return (
    <div className={styles.stack}>
      {caseStudies.map((caseStudy, index) => (
        <WorkStackCard caseStudy={caseStudy} key={caseStudy.id} stackIndex={index} />
      ))}
    </div>
  );
}

export default WorkStackMobile;
