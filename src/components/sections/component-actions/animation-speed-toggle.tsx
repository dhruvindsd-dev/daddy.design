import Tabs from "@/components/ui/tabs";
import useDurationStore from "@/stores/duration-store";

const DURATIONS = [
  { value: 1, label: "1x" },
  { value: 3, label: "0.5x" },
];

const AniSpeedToggle = () => {
  const { duration, setDuration } = useDurationStore();
  const value = DURATIONS.find((d) => d.value === duration) || DURATIONS[0];
  return (
    <div className="absolute top-12 right-12 flex flex-col gap-3">
      <Tabs
        items={DURATIONS}
        value={value}
        setValue={(v) => setDuration(v.value)}
      />
    </div>
  );
};
export default AniSpeedToggle;
