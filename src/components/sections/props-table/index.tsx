import Icon from "@/components/ui/icon";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Props {
  items: {
    name: string;
    type: string;
    default_value: string;
    description: string;
  }[];
  className?: string;
}

const PropsTable = ({ items, className }: Props) => {
  function format(value: string) {
    if (!value.includes("`")) return <code>{value}</code>;

    const parts = value.split(/(`[^`]+`)/g);
    return (
      <>
        {parts.map((part, index) => {
          // backticked content
          if (part.startsWith("`") && part.endsWith("`")) {
            return <code key={index}>{part.slice(1, -1)}</code>;
          }

          // plain content
          return (
            <span key={index} className="opacity-60">
              {part}
            </span>
          );
        })}
      </>
    );
  }

  return (
    <table className={cn("table table-fixed", className)}>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
        </tr>
      </thead>
      <tbody>
        {items.map((i) => (
          <tr key={i.name}>
            <td>
              <div className="flex items-center gap-1.5">
                {format(i.name)}

                <Popover>
                  <PopoverTrigger className="text-ds-text-3 hover:bg-ds-bg-100 hover:text-ds-text-2 flex size-5 cursor-pointer items-center justify-center rounded-[4px] transition-colors">
                    <Icon name="INFO_OUTLINE" size={12} />
                  </PopoverTrigger>
                  <PopoverContent side="top">
                    <p className="text-ds-text-2 text-xs font-medium">
                      {i.description}
                    </p>
                  </PopoverContent>
                </Popover>
              </div>
            </td>
            <td>{format(i.type)}</td>
            <td>{format(i.default_value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default PropsTable;
