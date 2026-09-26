import type { ReactNode } from "react";

import styles from "~/components/Tag/Tag.module.css";
import classNames from "~/lib/classNames";

type TagElement = "li" | "span";
type TagVariant = "dates" | "default" | "domain";

interface TagProps {
  as?: TagElement;
  children: ReactNode;
  variant?: TagVariant;
}

const VARIANT_CLASS: Record<TagVariant, string | undefined> = {
  dates: styles.dates,
  default: undefined,
  domain: styles.domain,
};

function Tag({ as: Element = "li", children, variant = "default" }: TagProps) {
  return <Element className={classNames(styles.tag, VARIANT_CLASS[variant])}>{children}</Element>;
}

export default Tag;
