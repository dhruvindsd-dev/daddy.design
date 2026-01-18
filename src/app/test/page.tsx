const imgGroup =
  "http://localhost:3845/assets/e3787c82ccec3035dfb544d37dad4a91c99fd491.svg";

interface Props {}

const Index = ({}: Props) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#FCFCFC]">
      <button
        className="flex items-center gap-1.5 overflow-clip rounded-[5px] bg-white px-2 py-1 outline-[0.5px] outline-black/10"
        style={{
          boxShadow: `hsl(0 0% 0% / 0.022) 0px 3px 6px -2px, hsl(0 0% 0% / 0.044) 0px 1px 1px`,
        }}
      >
        <img alt="" className="block size-4" src={imgGroup} />
        <p className="relative shrink-0 text-[13px] font-medium text-black">
          Daily Briefs
        </p>
      </button>
    </div>
  );
};
export default Index;
