import ComponentContent from "@/components/sections/component-content";
import ComponentWrapper from "@/components/sections/component-wrapper";
import CurvedScrollbarDemo from "@/registry/curved-scrollbar/demo";
import { COMPS } from "@/registry";

const Index = () => {
  return (
    <div className="relative">
      <ComponentWrapper>
        <CurvedScrollbarDemo />
      </ComponentWrapper>

      <ComponentContent
        component={COMPS.CURVED_SCROLLBAR}
        propsTableData={[
          {
            name: "children",
            type: "React.ReactNode",
            default_value: "-",
            description: "Scrollable content rendered inside the framed shell.",
          },
          {
            name: "className",
            type: "string",
            default_value: "-",
            description:
              "Additional classes applied to the scrollable content container.",
          },
          {
            name: "thumbClassName",
            type: "string",
            default_value: "-",
            description: "Extra classes applied to the curved scrollbar thumbs.",
          },
          {
            name: "disableHorizontal",
            type: "boolean",
            default_value: "false",
            description: "Disables the horizontal scrollbar track and thumb.",
          },
          {
            name: "framePadding",
            type: "number",
            default_value: "16",
            description:
              "Padding between the outer shell and the scrollable content area.",
          },
          {
            name: "config",
            type:
              "{ radius?: number; stroke?: number; trail?: number; thumb?: number; thumbOffsetEnd?: number; }",
            default_value: "{}",
            description:
              "Optional values for the scrollbar radius, stroke, trail, thumb length, and thumb offsets.",
          },
        ]}
      />
    </div>
  );
};

export default Index;
