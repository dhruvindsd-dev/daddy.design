import ICONS, { IconName } from "@/assets/icons";

interface Props {
  name: IconName;
  size?: number;
  className?: string;
}

const Icon = ({ size = 18, name, className }: Props) => {
  const SVG = ICONS[name];
  return <SVG height={size} width={size} className={className} />;
};
export default Icon;
