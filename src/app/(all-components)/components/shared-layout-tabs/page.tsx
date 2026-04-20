import ComponentContent from "@/components/sections/component-content";
import ComponentWrapper from "@/components/sections/component-wrapper";
import { COMPS } from "@/registry";
import SharedLayoutTabsDemo from "@/registry/shared-layout-tabs/demo";

const Index = () => {
  return (
    <div className="relative">
      <ComponentWrapper>
        <SharedLayoutTabsDemo />
      </ComponentWrapper>

      <ComponentContent
        component={COMPS.SHARED_LAYOUT_TABS}
        attibution="Inspired by and adapted from a shared-layout tabs interaction from a separate project, with the tab icons intentionally removed for this version."
        propsTableData={[
          {
            name: "data",
            type: "SharedLayoutTabsItem[]",
            default_value: "required",
            description:
              "Items rendered across the list, card, and stacked pack layouts.",
            type_info:
              '`{ img: string; title: string; price: number; cur: string; id: number }`',
          },
          {
            name: "tab",
            type: '"list" | "card" | "pack"',
            default_value: "required",
            description: "Active layout variant shown by the component.",
          },
          {
            name: "transition",
            type: "Transition (from motion/react)",
            default_value: '{ type: "spring", duration: 0.4, bounce: 0.2 }',
            description:
              "Shared motion transition used for the layout and stack animations.",
          },
        ]}
      />
    </div>
  );
};

export default Index;
