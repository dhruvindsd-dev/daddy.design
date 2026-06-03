import ComponentContent from "@/components/sections/component-content";
import ComponentWrapper from "@/components/sections/component-wrapper";
import { COMPS } from "@/registry";
import BoingBoingMenuDemo from "@/registry/boing-boing-menu/demo";

const Index = () => {
  return (
    <div className="relative">
      <ComponentWrapper>
        <BoingBoingMenuDemo />
      </ComponentWrapper>

      <ComponentContent
        component={COMPS.BOING_BOING_MENU}
        propsTableData={[
          {
            name: "items",
            type: "BoingBoingMenuItem[]",
            default_value: "required",
            description:
              "Menu actions rendered as bouncy icon buttons with animated labels.",
            type_info:
              '`{ icon: ReactNode; label: string; kbd?: string; click?: () => void; action?: "copy"; disabled?: boolean; }`',
          },
          {
            name: "deps",
            type: "unknown[]",
            default_value: "-",
            description:
              "Optional dependency values that trigger the press animation when they change.",
          },
          {
            name: "className",
            type: "string",
            default_value: "-",
            description:
              "Additional classes applied to the outer menu container.",
          },
          {
            name: "ariaLabel",
            type: "string",
            default_value: '"Boing boing menu"',
            description: "Accessible label for the menu button group.",
          },
          {
            name: "dur",
            type: "{ press?: number; pressNormalize?: number; hoverNormalize?: number; springDur?: number; springBounce?: number }",
            default_value: "-",
            description:
              "Timing and spring controls for press, hover, and tooltip movement.",
          },
        ]}
      />
    </div>
  );
};

export default Index;
