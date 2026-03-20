import fs from "fs/promises";
import CliInstall from "@/components/ui/cli-install";
import Code from "@/components/ui/code";
import { Steps, StepContent, Step } from "@/components/ui/steps";
import { ROUTES } from "@/lib/const";
import { getFilePath } from "@/lib/utils";
import { COMPS, COMP_DATA } from "@/registry";
import { globby } from "globby";
import SetComponentActions from "../component-actions/set-actions";
import FileName from "./file-name";
import SourceUtilsCode from "./source-utils-code";
import { createPrompt } from "./utils";
import InstallationHoc from "./hoc";

interface Props {
  component: COMPS;
}
const Installation = async ({ component }: Props) => {
  const obj = COMP_DATA[component];
  if (!obj) return <div>Component not found</div>;

  const [d, m] = await Promise.all([
    globby([getFilePath(obj.slug, obj.copyTargets?.demo || "demo.tsx")]),
    globby([getFilePath(obj.slug, obj.copyTargets?.main || "index.tsx")]),
  ]);

  const [dCode, mCode] = await Promise.all([
    fs.readFile(d[0], "utf8"),
    fs.readFile(m[0], "utf8"),
  ]);

  const prompt = createPrompt(obj, dCode, mCode);
  return (
    <>
      <SetComponentActions component={component} prompt={prompt} code={mCode} />
      <section>
        <p className="font-semibold">Installation</p>
        <hr className="my-6" />
        <InstallationHoc
          cli={<Cli slug={component} />}
          vibe={<Code disableHighlight code={prompt} />}
          manual={
            <Manual
              mCode={mCode}
              dCode={dCode}
              slug={component}
              packages={obj.packages || ["motion", "tailwind-merge", "clsx"]}
            />
          }
        />
      </section>
    </>
  );
};
export default Installation;

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

function Manual({
  mCode,
  dCode,
  slug,
  packages,
}: {
  slug: string;
  mCode: string;
  dCode: string;
  packages: string[];
}) {
  return (
    <Steps>
      <StepContent>
        <Step>Install Packages</Step>
        <CliInstall cmd={packages.join(" ")} />
      </StepContent>

      <StepContent>
        <Step>Create a file for utility functions</Step>
        <FileName>
          <span className="opacity-80"> lib</span>
          <span className="text-ds-text-1 font-bold">/utils.ts </span>
        </FileName>
        <SourceUtilsCode />
      </StepContent>

      <StepContent>
        <Step>Copy Source Code</Step>
        <FileName>
          <span className="min-w-0 truncate opacity-80">
            components/ui/{slug}
          </span>
          <span className="text-ds-text-1 shrink-0 font-bold">/index.tsx</span>
        </FileName>
        <Code code={mCode} />
      </StepContent>

      <StepContent>
        <Step>
          Copy Demo Component Code{" "}
          <code className="text-ds-text-3 ml-1 font-mono text-xs">
            Optional
          </code>
        </Step>
        <FileName>
          <span className="min-w-0 truncate opacity-80">
            components/ui/{slug}
          </span>
          <span className="text-ds-text-1 shrink-0 font-bold">/demo.tsx</span>
        </FileName>

        <Code code={dCode} />
      </StepContent>
    </Steps>
  );
}
