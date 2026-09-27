import { Children, useRef, type CSSProperties, type ReactNode } from "react";

import styles from "~/features/home/components/SectionStack.module.css";
import useStickyStack, { STACK_FRAME_ATTRIBUTE } from "~/hooks/useStickyStack";

interface SectionStackProps {
  children: ReactNode;
  followerId: string;
  lead: ReactNode;
}

const FIRST_CARD_LAYER = 2;
const FRAME_PROPS = { [STACK_FRAME_ATTRIBUTE]: "" };

function layerStyle(layer: number): CSSProperties {
  return { "--stack-layer": layer } as CSSProperties;
}

function SectionStack({ children, followerId, lead }: SectionStackProps) {
  const leadRef = useRef<HTMLDivElement>(null);
  useStickyStack(leadRef, followerId);

  return (
    <>
      <div className={styles.lead} ref={leadRef} {...FRAME_PROPS}>
        {lead}
      </div>
      {Children.map(children, (child, index) => (
        <div className={styles.card} style={layerStyle(FIRST_CARD_LAYER + index)} {...FRAME_PROPS}>
          {child}
        </div>
      ))}
      <div aria-hidden="true" className={styles.runout} />
    </>
  );
}

export default SectionStack;
