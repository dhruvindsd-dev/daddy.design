import ComponentContent from "@/components/sections/component-content";
import { COMPS } from "@/registry";
import DynamicScrollIslandTocDemo from "@/registry/dynamic-scroll-island-toc/demo";

const Index = () => {
  return (
    <div className="relative">
      <div className="relative flex h-screen w-screen items-center justify-center">
        <DynamicScrollIslandTocDemo />
      </div>

      <div className="mx-auto mt-20 max-w-3xl">
        <ComponentContent
          component={COMPS.DYNAMIC_SCROLL_ISLAND}
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
    </div>
  );
};
export default Index;
