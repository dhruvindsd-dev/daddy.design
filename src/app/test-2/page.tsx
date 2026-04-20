import type { Metadata } from "next";
import Community from "@/components/test-2/community";

export const metadata: Metadata = {
  title: "test-2",
};

export default function TestTwoPage() {
  return (
    <main className="relative h-[100svh] w-full overflow-hidden bg-[#f4f1ea]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff_0%,rgba(255,255,255,0.96)_18%,rgba(244,241,234,0.92)_52%,#e6e0d4_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(38,38,38,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(38,38,38,0.06)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_84%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/70 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#f4f1ea] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#e6e0d4] to-transparent" />

      <section
        aria-label="Infinite canvas demo"
        className="relative h-full w-full overflow-hidden"
      >
        <Community />
      </section>
    </main>
  );
}
