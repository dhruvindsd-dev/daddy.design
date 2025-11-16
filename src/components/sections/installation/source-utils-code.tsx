import Code from "@/components/ui/code";

const code = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
const SourceUtilsCode = () => {
  return <Code code={code} />;
};

export default SourceUtilsCode;
