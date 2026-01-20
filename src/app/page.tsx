// import { DynamicAllComponentsView } from "@/components/sections/all-elements";
import { DynamicAllComponentsView } from "@/components/sections/masonary-view";
import RandomComponent from "@/components/sections/random-component";
import BouncyButton from "@/components/ui/bouncy-button";
import Icon from "@/components/ui/icon";
import Logo from "@/components/ui/logo";
import { X_LINK } from "@/lib/const";
import { TbBrandX } from "react-icons/tb";

const AllComponents = () => {
  return (
    <main>
      <div className="p-4">
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="border-border relative overflow-hidden rounded-2xl border bg-white">
            <div className="relative z-50 flex h-full flex-col justify-end gap-10 p-6 md:p-12">
              <Logo large className="shadow-xl shadow-black/20" />

              <p className="text-3xl font-extrabold text-balance md:text-4xl">
                Copy paste the best interactive component directly into your
                project
              </p>
              <div className="text-ds-text-2 flex flex-col gap-3 text-sm leading-[1.333] font-medium md:text-base">
                <div className="flex items-center gap-2">
                  <Icon name="COPY_2" size={20} />
                  <p>Copy paste into your project using ShadCn</p>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="V0" size={20} />
                  <p>One click import to V0</p>
                </div>
                <div className="flex items-center gap-2">
                  <Icon size={20} name="VIBE_CODING" />
                  <p>Vibe Coding prompt</p>
                </div>
              </div>
              <a
                href={X_LINK}
                target="_blank"
                rel="noreferrer"
                aria-label="Follow on X"
                className="w-fit"
              >
                <BouncyButton>
                  <TbBrandX size={18} />
                  Follow for updates
                </BouncyButton>
              </a>
            </div>
          </div>

          <RandomComponent />
        </div>
        <DynamicAllComponentsView />
      </div>

      <div className="bg-bg/20 pointer-events-none fixed bottom-0 z-298 h-[100px] w-full [mask-image:linear-gradient(to_top,rgb(0,0,0)_5%,transparent_100%)] backdrop-blur-[5px]" />
    </main>
  );
};
export default AllComponents;
