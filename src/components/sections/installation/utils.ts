import { IComp } from "@/registry";
import { highlight } from "sugar-high";

export function createPrompt(obj: IComp, dCode: string, mCode: string) {
  return `You are given a task to integrate a React component into your codebase.
Please verify your project has the following setup:
- shadcn/ui project structure
- Tailwind CSS v4.0
- TypeScript

If any of these are missing, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 

If the default components path is not /components/ui then do the following:
	•	Provide a clear explanation of why using /components/ui is the convention.
	•	Include instructions on how to create and use this directory for consistency and maintainability.

---

Copy the below components into /components/ui

File location: components/ui/${obj.slug}/demo.tsx
File Content: 
${highlight(dCode)}

File location: components/ui/${obj.slug}/index.tsx
File Content: 
${highlight(mCode)}`;
}
