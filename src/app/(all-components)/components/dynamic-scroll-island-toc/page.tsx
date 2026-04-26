import ComponentContent from "@/components/sections/component-content";
import ComponentWrapper from "@/components/sections/component-wrapper";
import { COMPS } from "@/registry";
import DynamicScrollIslandTocDemo from "@/registry/dynamic-scroll-island-toc/demo";

const Index = () => {
  return (
    <div className="relative">
      <ComponentWrapper>
        <DynamicScrollIslandTocDemo />
      </ComponentWrapper>

      <ComponentContent
        component={COMPS.DYNAMIC_SCROLL_ISLAND}
        attibution="Heavily inspired by Nitish Khagwal. "
        propsTableData={[
          {
            name: "data",
            type: "TOC_INTERFACE[]",
            default_value: "required",
            description:
              "Items rendered in the expandable table of contents menu.",
            type_info: "`{ name: string; value?: string }`",
          },
          {
            name: "value",
            type: "TOC_INTERFACE",
            default_value: "-",
            description:
              "Controlled active item shown in the island title and used to toggle the clear state.",
            type_info: "`{ name: string; value?: string }`",
          },
          {
            name: "setValue",
            type: "(value: TOC_INTERFACE) => void",
            default_value: "-",
            description:
              "Callback fired when a table of contents item or the clear button is selected.",
          },
          {
            name: "ref",
            type: "RefObject<HTMLElement | null>",
            default_value: "-",
            description:
              "Optional scroll container ref used to calculate progress instead of the window.",
          },
          {
            name: "transition",
            type: "Transition (from motion/react)",
            default_value: '{ type: "spring", duration: 0.5, bounce: 0.1 }',
            description:
              "Shared motion transition applied to the island layout animations.",
          },
          {
            name: "className",
            type: "string",
            default_value: "-",
            description: "Additional classes applied to the root island wrapper.",
          },
          {
            name: "lPrefix",
            type: "string",
            default_value: "-",
            description:
              "Optional prefix for internal layout ids when rendering multiple islands on the same page.",
          },
        ]}
      />
    </div>
  );
};
export default Index;
