import logoMark from "~/assets/logo-mark.svg";

interface LogoMarkProps {
  className?: string;
}

const LOGO_WIDTH = 253;
const LOGO_HEIGHT = 234;

function LogoMark({ className }: LogoMarkProps) {
  return (
    <img alt="" className={className} height={LOGO_HEIGHT} src={logoMark} width={LOGO_WIDTH} />
  );
}

export default LogoMark;
