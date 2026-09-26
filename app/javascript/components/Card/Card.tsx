import type { ReactNode } from "react";

import styles from "~/components/Card/Card.module.css";
import classNames from "~/lib/classNames";

type CardElement = "article" | "div" | "li" | "section";
type CardSurface = "surface" | "surface-2";

interface CardProps {
  as?: CardElement;
  children: ReactNode;
  className?: string;
  isLiftedOnHover?: boolean;
  surface?: CardSurface;
}

const SURFACE_CLASS: Record<CardSurface, string | undefined> = {
  surface: undefined,
  "surface-2": styles.surface2,
};

function Card({
  as: Element = "div",
  children,
  className,
  isLiftedOnHover = false,
  surface = "surface",
}: CardProps) {
  return (
    <Element
      className={classNames(
        styles.card,
        SURFACE_CLASS[surface],
        isLiftedOnHover && styles.lift,
        className,
      )}
    >
      {children}
    </Element>
  );
}

export default Card;
