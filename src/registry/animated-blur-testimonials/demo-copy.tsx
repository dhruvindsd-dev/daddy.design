"use client";

import AnimatedBlurTestimonials, {
    TestimonialInterface,
} from "@/registry/animated-blur-testimonials";

const DATA: TestimonialInterface[] = [
  {
    avatar: { src: "https://randomuser.me/api/portraits/lego/4.jpg" },
    message:
      "Was suspicious of Daddy. Now my boss respects me, my ex is jealous, and strangers nod at me. Thanks, Daddy",
  },

  {
    avatar: { src: "https://randomuser.me/api/portraits/lego/6.jpg" },
    message:
      "I joined Daddy thinking it was a parenting advice site. It wasn’t. But somehow, my life improved—more confidence, better decisions, and free high-fives from the universe. Was it magic? Destiny? Daddy's Magic? Vim? Either way, I’m staying",
  },
  {
    avatar: { src: "https://randomuser.me/api/portraits/men/34.jpg" },
    message:
      "My clients think I’m a front-end god. Joke’s on them, I just clicked Cmd + C. Thanks, Daddy",
  },
  {
    avatar: { src: "https://randomuser.me/api/portraits/lego/2.jpg" },
    message:
      "Before Daddy, I was just a regular person. Now? My skin is clearer, my coffee tastes better, and I parallel park like a pro. People ask, ‘What’s your secret?’ I just smile and whisper… Daddy",
  },
  {
    avatar: { src: "https://randomuser.me/api/portraits/lego/1.jpg" },
    message:
      "At first, I laughed at the name. ‘Daddy? No way.’ But then, weirdly, life got better—better deals, better luck, even my bad hair days disappeared. I can’t explain it, but I trust Daddy now. And so should you.",
  },
];

function AnimatedBlurTestimonialsDemo() {
  return (
    <div className="relative flex min-h-[400px] items-center justify-center px-3 py-8">
      <div className="max-w-[450px]">
        <AnimatedBlurTestimonials data={DATA} />
      </div>
    </div>
  );
}
export default AnimatedBlurTestimonialsDemo;
