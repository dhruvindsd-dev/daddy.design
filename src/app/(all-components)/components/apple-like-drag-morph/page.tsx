import ComponentContent from "@/components/sections/component-content";
import ComponentWrapper from "@/components/sections/component-wrapper";
import { COMPS } from "@/registry";
import AppleLikeDragMorphDemo from "@/registry/apple-like-drag-morph/demo";

const Index = () => {
  return (
    <div className="relative">
      <ComponentWrapper>
        <AppleLikeDragMorphDemo />
      </ComponentWrapper>

      <ComponentContent
        component={COMPS.APPLE_LIKE_DRAG_MORPH}
        propsTableData={[
          {
            name: "className",
            type: "string",
            default_value: "-",
            description: "Additional classes applied to the draggable button.",
          },
          {
            name: "children",
            type: "React.ReactNode",
            default_value: "inline arrow icon",
            description: "Content rendered inside the morphing button.",
          },
          {
            name: "maxStretch",
            type: "number",
            default_value: "1.5",
            description:
              "Upper limit for how far the button stretches during drag.",
          },
          {
            name: "minScale",
            type: "number",
            default_value: "0.2",
            description:
              "Lowest allowed compressed scale on the opposite axis.",
          },
          {
            name: "dragSensitivity",
            type: "number",
            default_value: "0.003",
            description:
              "Multiplier that converts drag distance into stretch amount.",
          },
          {
            name: "bounceStretch",
            type: "number",
            default_value: "1.2",
            description: "Scale applied on the stretched axis after a click.",
          },
          {
            name: "bounceSquish",
            type: "number",
            default_value: "0.9",
            description: "Scale applied on the compressed axis after a click.",
          },
          {
            name: "bounceDuration",
            type: "number",
            default_value: "160",
            description:
              "How long the click bounce lasts before returning to rest.",
          },
          {
            name: "springConfig",
            type: "{ stiffness?: number; damping?: number; }",
            default_value: '{ stiffness: 520, damping: 10 }',
            description:
              "Spring settings used by the X and Y scale motion values.",
          },
          {
            name: "onClick",
            type: "() => void",
            default_value: "-",
            description:
              "Optional callback fired before the click bounce animation runs.",
          },
        ]}
      />
    </div>
  );
};

export default Index;
