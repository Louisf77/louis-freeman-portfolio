import type { CSSProperties } from "react";

import Tag from "~/components/Tag/Tag";
import styles from "~/features/home/components/CapabilityCard.module.css";
import type { CapabilityGroup } from "~/types/contracts";

interface CapabilityCardProps {
  group: CapabilityGroup;
  stackIndex: number;
}

function CapabilityCard({ group, stackIndex }: CapabilityCardProps) {
  const stackStyle = { "--stack-index": stackIndex } as CSSProperties;

  return (
    <div className={styles.card} style={stackStyle}>
      <h3 className={styles.title}>{group.title}</h3>
      <ul className={styles.chips}>
        {group.capabilities.map((capability) => (
          <Tag key={capability.id}>{capability.name}</Tag>
        ))}
      </ul>
    </div>
  );
}

export default CapabilityCard;
