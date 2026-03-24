import PropsTable, { PropsTableData } from "@/components/sections/props-table";
import Installation from "@/components/sections/installation";
import { COMPS } from "@/registry";

interface Props {
  component: COMPS;
  propsTableData: PropsTableData[];
  attibution?: string;
}

const ComponentContent = ({ component, propsTableData, attibution }: Props) => {
  return (
    <div className="mx-auto mt-10 sm:mt-20 max-w-3xl px-4 sm:px-4">
      <Installation component={component} />

      <div className="mt-40" />
      <p className="font-semibold">Props</p>
      <hr className="my-6" />
      <PropsTable className="mt-6" items={propsTableData} />

      {attibution && (
        <>
          <div className="mt-40" />
          <p className="tracking-right font-semibold">Attribution</p>
          <hr className="my-6" />
          <p>{attibution}</p>
        </>
      )}
      <div className="mt-40" />
    </div>
  );
};
export default ComponentContent;
