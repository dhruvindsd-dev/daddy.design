"use client";
import { useEffect, useState } from "react";

const IS_CLIENT = typeof window === "object";

const mediaQueryMap = {
  mobile: "(max-width: 768px)",
  touch: "(max-width: 1200px)",

  sm: "(max-width: 640px)",
  md: "(max-width: 768px)",
  lg: "(max-width: 1024px)",
  xl: "(max-width: 1280px)",
  "2xl": "(max-width: 1536px)",
};

export function useMediaQuery(
  query: keyof typeof mediaQueryMap,
  initialVal?: boolean,
) {
  const [matches, setMatches] = useState(() => {
    if (typeof initialVal === "boolean") return initialVal;
    if (!IS_CLIENT) return false;
    return window.matchMedia(mediaQueryMap[query]).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(mediaQueryMap[query]);
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }

    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [query]);

  return matches;
}

export function useIsMobile(initialVal?: boolean) {
  return useMediaQuery("mobile", initialVal);
}
