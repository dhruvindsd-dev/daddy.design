import fs from "fs/promises";
import { getFilePath } from "@/lib/utils";
import { COMP_DATA } from "@/registry";
import { globby } from "globby";
import InstallationHoc from "@/components/sections/installation/hoc";
import { Steps, Step, StepContent } from "@/components/ui/steps";
import CliInstall from "@/components/ui/cli-install";
import { ROUTES } from "@/lib/const";
import Code from "@/components/ui/code";
import { createPrompt } from "@/components/sections/installation/utils";
import SourceUtilsCode from "@/components/sections/installation/source-utils-code";
import FileName from "@/components/sections/installation/file-name";

const Install = async () => {
  const obj = COMP_DATA["family-button"];
  if (!obj) return <div>Component not found</div>;

  const [d, m] = await Promise.all([
    globby([getFilePath(obj.slug, obj.copyTargets?.demo || "demo.tsx")]),
    globby([getFilePath(obj.slug, obj.copyTargets?.main || "index.tsx")]),
  ]);

  const [dCode, mCode] = await Promise.all([
    fs.readFile(d[0], "utf8"),
    fs.readFile(m[0], "utf8"),
  ]);

  return (
    <section>
      <p className="tracking-right font-semibold">Installation</p>
      <hr className="my-6" />
      <InstallationHoc
        cli={<Cli slug={"family-button"} />}
        vibe={<Code disableHighlight code={createPrompt(obj, dCode, mCode)} />}
        manual={<Manual code={mCode} slug={"family-button"} />}
      />
    </section>
  );
};
export default Install;

function Cli({ slug }: { slug: string }) {
  return (
    <Steps>
      <StepContent>
        <Step>Run the following Command</Step>
        <CliInstall cmd={`${ROUTES.r}/${slug}.json`} />
      </StepContent>

      <StepContent>
        <Step>Install the demo compoennt (optional)</Step>
        <CliInstall cmd={`${ROUTES.r}/${slug}-demo.json`} />
      </StepContent>
    </Steps>
  );
}

function Manual({ code, slug }: { code: string; slug: string }) {
  return (
    <Steps>
      <StepContent>
        <Step>Install Packages</Step>
        <CliInstall
          cmd={["motion", "tailwind-merge", "clsx", "react-icons"].join(" ")}
        />
      </StepContent>

      <StepContent>
        <Step>Create a file for utility functions</Step>
        <FileName>lib/utils.ts</FileName>
        <SourceUtilsCode />
      </StepContent>

      <StepContent>
        <Step>Copy Source Code</Step>
        <FileName>components/ui/{slug}/index.tsx</FileName>
        <Code code={code} />
      </StepContent>
    </Steps>
  );
}
