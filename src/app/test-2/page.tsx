import type { Metadata } from "next";
import Community from "@/components/test-2/community";

export const metadata: Metadata = {
  title: "Infinite canvas demo",
};

const BACKDROP_LAYERS = [
  "absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff_0%,rgba(255,255,255,0.96)_18%,rgba(244,241,234,0.92)_52%,#e6e0d4_100%)]",
  "absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/70 to-transparent",
  "absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#f4f1ea] to-transparent",
  "absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#e6e0d4] to-transparent",
];

export default function TestTwoPage() {
  return (
    <main className="relative isolate h-svh w-full overflow-clip bg-[#f4f1ea]">
      {BACKDROP_LAYERS.map((className) => (
        <div
          key={className}
          aria-hidden="true"
          className={`pointer-events-none ${className}`}
        />
      ))}

      <section
        aria-label="Infinite canvas demo"
        className="relative h-full w-full overflow-clip"
      >
        <Community />
      </section>
    </main>
  );
}
