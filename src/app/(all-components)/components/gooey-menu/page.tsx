import ComponentContent from "@/components/sections/component-content";
import { COMPS } from "@/registry";
import GooeyMenuDemo from "@/registry/gooey-menu/demo";

const Index = () => {
  return (
    <div className="relative">
      <div className="relative h-screen w-screen">
        <GooeyMenuDemo />
      </div>

      <div className="mx-auto mt-20 max-w-3xl">
        <ComponentContent
          component={COMPS.GOOEY_MENU}
          propsTableData={[
            {
              name: "items",
              type: "MenuItem[]",
              default_value: "required",
              description: "Menu items rendered as animated action buttons.",
              type_info: "\`{ icon: React.ReactElement; name?: string; metadata?: any; value?: any; }\`",
            },
            {
              name: "className",
              type: "string",
              default_value: "-",
              description:
                "Additional classes applied to the main toggle button.",
            },
            {
              name: "filterId",
              type: "string",
              default_value: '"gooey-menu-filter"',
              description: "SVG filter id used for the gooey blur effect.",
            },
            {
              name: "transition",
              type: "Transition (from motion/react)",
              default_value: '{ type: "spring", duration: 0.5, bounce: 0.3 }',
              description:
                "Shared motion transition configuration for menu animations.",
            },
            {
              name: "onChange",
              type: "(item: MenuItem) => void",
              default_value: "-",
              description: "Callback fired when a menu item is selected.",
            },
            {
              name: "direction",
              type: '"left" | "right" | "top" | "bottom"',
              default_value: '"bottom"',
              description:
                "Direction items expand relative to the toggle button.",
            },
          ]}
        />
      </div>
    </div>
  );
};
export default Index;
