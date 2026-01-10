import ComponentContent from "@/components/sections/component-content";
import { COMPS } from "@/registry";
import AnimatedBlurTestimonialsDemo from "@/registry/animated-blur-testimonials/demo";

const Index = () => {
  return (
    <div className="relative">
      <div className="relative h-screen w-screen">
        <AnimatedBlurTestimonialsDemo />
      </div>

      <div className="mx-auto mt-20 max-w-3xl">
        <ComponentContent
          component={COMPS.ANIMATED_BLUR_TESTIMONIALS}
          propsTableData={[
            {
              name: "data",
              type: "TestimonialInterface[]",
              default_value: "required",
              description:
                "List of testimonials used for avatars, messages, progress indicators, and navigation.",
            },
            {
              name: "light",
              type: "boolean",
              default_value: "-",
              description:
                "Defined but unused; has no effect on rendering or behavior.",
            },
            {
              name: "delayDuration",
              type: "number",
              default_value: "8",
              description:
                "Interval in seconds between automatic testimonial transitions.",
            },
            {
              name: "_duration",
              type: "number",
              default_value: "0.4",
              description:
                "Animation duration in seconds for motion transitions.",
            },
          ]}
        />
      </div>
    </div>
  );
};
export default Index;
