import Tag from "~/components/Tag/Tag";
import styles from "~/features/home/components/CapabilitiesSection.module.css";
import CapabilityCard from "~/features/home/components/CapabilityCard";
import StackTicker from "~/features/home/components/StackTicker";
import { useUi } from "~/lib/ui";
import type { CapabilitiesSection as CapabilitiesSectionContent } from "~/types/contracts";

interface CapabilitiesSectionProps {
  capabilities: CapabilitiesSectionContent;
}

const HEADING_ID = "capabilities-title";

function CapabilitiesSection({ capabilities }: CapabilitiesSectionProps) {
  const t = useUi();

  return (
    <section aria-labelledby={HEADING_ID} className={styles.section} id="capabilities">
      <div className={styles.header}>
        <h2 className={styles.title} id={HEADING_ID}>
          {capabilities.title}
        </h2>
        <p className={styles.intro}>{capabilities.intro}</p>
      </div>
      <div className={styles.body}>
        {capabilities.groups.length > 0 && (
          <div className={styles.grid}>
            {capabilities.groups.map((group, index) => (
              <CapabilityCard group={group} key={group.id} stackIndex={index} />
            ))}
          </div>
        )}
        {capabilities.domains.length > 0 && (
          <div className={styles.domainBox}>
            <span className={styles.domainLabel}>{t("capabilities_domain_label")}</span>
            <ul className={styles.domainChips}>
              {capabilities.domains.map((domain) => (
                <Tag key={domain.id} variant="domain">
                  {domain.label}
                </Tag>
              ))}
            </ul>
          </div>
        )}
      </div>
      <StackTicker className={styles.ticker} items={capabilities.ticker} />
    </section>
  );
}

export default CapabilitiesSection;
