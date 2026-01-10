import { COMPS } from "@/registry";
import { usePathname } from "next/navigation";

export default function useComponentName() {
  const path = usePathname();
  const isComponents = path.startsWith("/components/");

  if (!isComponents) return null;

  const compName = path.split("/").pop();

  return compName as COMPS;
}
