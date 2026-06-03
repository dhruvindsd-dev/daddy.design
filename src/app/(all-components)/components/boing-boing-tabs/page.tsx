import ComponentContent from "@/components/sections/component-content";
import ComponentWrapper from "@/components/sections/component-wrapper";
import { COMPS } from "@/registry";
import BoingBoingTabsDemo from "@/registry/boing-boing-tabs/demo";

const Index = () => {
  return (
    <div className="relative">
      <ComponentWrapper>
        <BoingBoingTabsDemo />
      </ComponentWrapper>

      <ComponentContent
        component={COMPS.BOING_BOING_TABS}
        propsTableData={[
          {
            name: "items",
            type: "BoingBoingTabsItem[]",
            default_value: "required",
            description:
              "Tabs rendered as elastic segmented controls with optional disabled states.",
            type_info:
              '`{ value: string | number; label: string; disabled?: boolean }`',
          },
          {
            name: "value",
            type: "BoingBoingTabsItem",
            default_value: "required",
            description: "Currently selected tab item.",
          },
          {
            name: "setValue",
            type: "(val: BoingBoingTabsItem) => void",
            default_value: "required",
            description: "Callback fired when a new enabled tab is selected.",
          },
          {
            name: "size",
            type: '"default" | "lg"',
            default_value: '"default"',
            description: "Controls tab height, padding, and text size.",
          },
          {
            name: "variant",
            type: '"default" | "light"',
            default_value: '"default"',
            description: "Switches between the dark and light tab surfaces.",
          },
          {
            name: "hoverNudge",
            type: "number",
            default_value: "4",
            description:
              "Distance used to elastically stretch the active pill toward hovered tabs.",
          },
          {
            name: "dur",
            type: "{ press?: number; pressNormalize?: number; hoverNormalize?: number; springDur?: number; springBounce?: number }",
            default_value: "-",
            description:
              "Timing and spring controls for press, hover, and active-pill movement.",
          },
        ]}
      />
    </div>
  );
};

export default Index;
