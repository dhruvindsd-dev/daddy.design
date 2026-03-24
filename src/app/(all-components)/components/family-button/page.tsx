import ComponentContent from "@/components/sections/component-content";
import ComponentWrapper from "@/components/sections/component-wrapper";
import { COMPS } from "@/registry";
import FamilyButtonDemo from "@/registry/family-button/demo";

const Index = () => {
  return (
    <div className="relative">
      <ComponentWrapper>
        <FamilyButtonDemo />
      </ComponentWrapper>

      <ComponentContent
        component={COMPS.FAMILY_BUTTON}
        attibution="Inspired by and adapted from the original Family website"
        propsTableData={[
          {
            name: "variant",
            type: '"loading" | "error" | "success"',
            default_value: "-",
            description:
              "Controls visual state, icon, text, and button color styling",
          },
          {
            name: "children",
            type: "React.ReactNode",
            default_value: "required",
            description:
              "Default button content when no variant-specific text is active",
          },
          {
            name: "icon",
            type: "React.ReactNode",
            default_value: "-",
            description:
              "Custom icon shown when variant is not loading, error, or success",
          },
          {
            name: "transition",
            type: "`Transition` (from motion/react)",
            default_value: '{ type: "spring", duration: 0.6, bounce: 0.4 }',
            description:
              "Global motion transition configuration for all child animations",
          },

          {
            name: "className",
            type: "string",
            default_value: "-",
            description:
              "Additional CSS classes merged with variant-based button styles",
          },
          {
            name: "text",
            type: "{ error?: string; loading?: string; success?: string }",
            default_value:
              '{ success: "Transaction Safe", loading: "Analyzing Transaction", error: "Transaction Warning" }',
            description:
              "Overrides default text labels for loading, error, and success states",
          },
        ]}
      />
    </div>
  );
};
export default Index;
