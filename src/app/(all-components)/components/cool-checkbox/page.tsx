import ComponentContent from "@/components/sections/component-content";
import { COMPS } from "@/registry";
import CoolCheckBoxDemo from "@/registry/cool-checkbox/demo";

const Index = () => {
  return (
    <div className="relative">
      <div className="relative flex h-screen w-screen items-center justify-center">
        <CoolCheckBoxDemo />
      </div>

      <ComponentContent
        component={COMPS.COOL_CHECKBOX}
        attibution="Inspired and Designed by Rauno's website"
        propsTableData={[
          {
            name: "todos",
            type: "{ id: number; title: string; checked: boolean }[]",
            default_value: "required",
            description:
              "List of todo items controlling checkbox state, labels, and animations.",
          },
          {
            name: "onToggle",
            type: "(id: number) => void",
            default_value: "required",
            description:
              "Callback invoked when a todo checkbox is clicked, passing the todo id.",
          },
        ]}
      />
    </div>
  );
};
export default Index;
