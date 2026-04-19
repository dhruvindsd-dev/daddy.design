import ComponentContent from "@/components/sections/component-content";
import ComponentWrapper from "@/components/sections/component-wrapper";
import { COMPS } from "@/registry";
import AiActionButtonDemo from "@/registry/ai-action-button/demo";

const Index = () => {
  return (
    <div className="relative">
      <ComponentWrapper>
        <AiActionButtonDemo />
      </ComponentWrapper>

      <ComponentContent
        component={COMPS.AI_ACTION_BUTTON}
        propsTableData={[
          {
            name: "state",
            type: '"idle" | "thinking" | "success"',
            default_value: '"idle"',
            description:
              "Controls the label, icon, and whether the aurora beams animate around the button.",
          },
          {
            name: "labels",
            type: "Partial<Record<AiActionButtonState, React.ReactNode>>",
            default_value: "-",
            description:
              "Overrides any of the default labels shown for the idle, thinking, and success states.",
          },
          {
            name: "transition",
            type: "Transition",
            default_value: '{ type: "spring", duration: 0.4, bounce: 0.2 }',
            description:
              "Shared Motion transition used for layout, text, and icon swaps.",
          },
          {
            name: "glowDuration",
            type: "number",
            default_value: "1",
            description:
              "Duration in seconds for the looping light sweep while the button is in the thinking state.",
          },
        ]}
      />
    </div>
  );
};

export default Index;
