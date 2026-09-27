import styles from "~/features/home/components/StackTicker.module.css";
import classNames from "~/lib/classNames";
import { useUi } from "~/lib/ui";
import type { LabelItem } from "~/types/contracts";

interface StackTickerProps {
  className?: string;
  items: LabelItem[];
}

const LOOP_COPIES = ["first", "second"] as const;
const LABEL_SEPARATOR = ", ";

function StackTicker({ className, items }: StackTickerProps) {
  const t = useUi();
  if (items.length === 0) return null;

  const summary = t("stack_ticker_label", {
    items: items.map((item) => item.label).join(LABEL_SEPARATOR),
  });

  return (
    <div aria-label={summary} className={classNames(styles.marquee, className)} role="img">
      <div aria-hidden="true" className={styles.track}>
        {LOOP_COPIES.flatMap((copy) =>
          items.map((item) => (
            <span className={styles.item} key={`${copy}-${String(item.id)}`}>
              {item.label}
              <span className={styles.diamond} />
            </span>
          )),
        )}
      </div>
    </div>
  );
}

export default StackTicker;
