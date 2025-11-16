import FamilyButtonContent from "@/components/pages/family-button/content";
import Controller from "@/components/sections/controls";
import BouncyMenu from "@/components/ui/bouncy-menu";
import Icon from "@/components/ui/icon";
import FamilyButtonDemo from "@/registry/family-button/demo";

const Index = () => {
  return (
    <div className="relative">
      <div className="relative h-screen w-screen">
        <FamilyButtonDemo />
        <div className="absolute top-12 right-12"></div>
        <div className="fixed bottom-12 left-12">
          <Controller />
        </div>
        <div className="fixed right-12 bottom-12">
          <BouncyMenu
            items={[
              { icon: <Icon name="CLI" />, label: "Cli" },
              { icon: <Icon name="PROMPT" />, label: "Prompt" },
              { icon: <Icon name="CODE" />, label: "Code" },
              { icon: <Icon name="V0" />, label: "V0" },
              { icon: <Icon name="INFO" />, label: "Info" },
            ]}
          />
        </div>
      </div>

      <div className="relative mx-auto mt-20 max-w-3xl">
        <FamilyButtonContent />
      </div>
    </div>
  );
};
export default Index;
