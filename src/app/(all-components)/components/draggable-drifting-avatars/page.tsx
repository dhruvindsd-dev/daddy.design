import ComponentContent from "@/components/sections/component-content";
import ComponentWrapper from "@/components/sections/component-wrapper";
import { COMPS } from "@/registry";
import DraggableDriftingAvatarsDemo from "@/registry/draggable-drifting-avatars/demo";

const Index = () => {
  return (
    <div className="relative">
      <ComponentWrapper>
        <DraggableDriftingAvatarsDemo />
      </ComponentWrapper>

      <ComponentContent
        component={COMPS.DRAGGABLE_DRIFTING_AVATARS}
        attibution="Inspired by various infinite canvas implementations"
        propsTableData={[
          {
            name: "mask",
            type: "{ enabled?: boolean; innerPercent?: number; outerPercent?: number }",
            default_value: "{ enabled: true, innerPercent: 20, outerPercent: 60 }",
            description: "Controls the radial gradient mask overlaying the canvas",
          },
          {
            name: "viewport",
            type: "{ size?: number; focusSize?: number; showRing?: boolean; ringOpacity?: number }",
            default_value: "{ size: 520, focusSize: 120, showRing: true, ringOpacity: 0.13 }",
            description: "Canvas sizing and the central focus ring overlay",
          },
          {
            name: "grid",
            type: "{ avatarSize?: number; gap?: number; rowStep?: number; rowOffset?: number }",
            default_value: "{ avatarSize: 40, gap: 4, rowStep: 20, rowOffset: 20 }",
            description: "Layout properties for the infinite avatar grid",
          },
          {
            name: "falloff",
            type: "{ focusInnerPercent?: number; minScale?: number; minOpacity?: number }",
            default_value: "{ focusInnerPercent: 30, minScale: 0.4, minOpacity: 0 }",
            description: "Scale and opacity decay outside the focus area",
          },
          {
            name: "motion",
            type: "{ autoSpeed?: number; drag?: number; dragBoost?: number; inertia?: number; maxSpeed?: number }",
            default_value: "{ autoSpeed: 0.6, drag: 1, dragBoost: 1.18, inertia: 0.91, maxSpeed: 48 }",
            description: "Drift speeds, drag sensitivity, and momentum characteristics",
          },
        ]}
      />
    </div>
  );
};

export default Index;
