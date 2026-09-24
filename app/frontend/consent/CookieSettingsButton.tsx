import { useConsent } from "~/consent/ConsentProvider";

interface CookieSettingsButtonProps {
  className?: string;
  label: string;
}

function CookieSettingsButton({ className, label }: CookieSettingsButtonProps) {
  const { open } = useConsent();

  return (
    <button className={className} onClick={open} type="button">
      {label}
    </button>
  );
}

export default CookieSettingsButton;
