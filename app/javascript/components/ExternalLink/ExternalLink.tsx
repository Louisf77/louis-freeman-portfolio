import type { ReactNode } from "react";

import { useUi } from "~/lib/ui";

interface ExternalLinkProps {
  children: ReactNode;
  className?: string;
  href: string;
  onClick?: () => void;
}

const NEW_TAB_TARGET = "_blank";
const NEW_TAB_REL = "noopener noreferrer";

function ExternalLink({ children, className, href, onClick }: ExternalLinkProps) {
  const t = useUi();

  return (
    <a
      className={className}
      href={href}
      onClick={onClick}
      rel={NEW_TAB_REL}
      target={NEW_TAB_TARGET}
    >
      {children} <span className="visually-hidden">{t("opens_in_new_tab")}</span>
    </a>
  );
}

export default ExternalLink;
