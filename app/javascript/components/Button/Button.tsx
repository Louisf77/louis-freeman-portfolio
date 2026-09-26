import type { ReactNode } from "react";
import { Link } from "react-router";

import styles from "~/components/Button/Button.module.css";
import classNames from "~/lib/classNames";

type ButtonSize = "regular" | "small";
type ButtonVariant = "ghost" | "primary";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  icon?: ReactNode;
  isDisabled?: boolean;
  isExternal?: boolean;
  onClick?: () => void;
  size?: ButtonSize;
  to?: string;
  type?: "button" | "submit";
  variant?: ButtonVariant;
}

const SIZE_CLASS: Record<ButtonSize, string | undefined> = {
  regular: undefined,
  small: styles.small,
};

const VARIANT_CLASS: Record<ButtonVariant, string | undefined> = {
  ghost: styles.ghost,
  primary: styles.primary,
};

function Button({
  children,
  className,
  href,
  icon,
  isDisabled = false,
  isExternal = false,
  onClick,
  size = "regular",
  to,
  type = "button",
  variant = "ghost",
}: ButtonProps) {
  const buttonClassName = classNames(
    styles.button,
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    className,
  );
  const content = (
    <>
      {children}
      {icon && (
        <span aria-hidden="true" className={styles.icon}>
          {icon}
        </span>
      )}
    </>
  );

  if (to !== undefined) {
    return (
      <Link className={buttonClassName} onClick={onClick} to={to}>
        {content}
      </Link>
    );
  }

  if (href !== undefined) {
    return (
      <a
        className={buttonClassName}
        href={href}
        onClick={onClick}
        rel={isExternal ? "noopener noreferrer" : undefined}
        target={isExternal ? "_blank" : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={buttonClassName}
      disabled={isDisabled}
      onClick={onClick}
      type={type === "submit" ? "submit" : "button"}
    >
      {content}
    </button>
  );
}

export default Button;
