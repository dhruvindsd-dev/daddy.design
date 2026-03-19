"use client";
import { useState, useEffect } from "react";

const IS_CLIENT = typeof window === "object";

const mediaQueryMap = {
  mobile: "(max-width: 768px)",
  touch: "(max-width: 1200px)",

  sm: "max-width: 640px",
  md: "max-width: 768px",
  lg: "max-width: 1024px",
  xl: "max-width: 1280px",
  "2xl": "max-width: 1536px",
};

export function useMediaQuery(
  query: keyof typeof mediaQueryMap,
  initialVal = IS_CLIENT && window.matchMedia(query).matches,
) {
  const [matches, setMatches] = useState(initialVal);

  useEffect(() => {
    const media = window.matchMedia(mediaQueryMap[query]);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
}

export function useIsMobile(initialVal?: boolean) {
  return useMediaQuery("mobile", initialVal);
}
