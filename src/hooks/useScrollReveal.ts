import { useEffect, useRef } from "react";
import type { RefObject } from "react";
export function useScrollReveal(
  dependency: string,
): RefObject<HTMLElement | null> {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = root.current;
    if (
      !element ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06 },
    );
    function observe() {
      element!
        .querySelectorAll(
          ".hero, .benefits, .editorial, .newsletter, .section-head",
        )
        .forEach((target) => {
          if (!target.classList.contains("reveal")) {
            target.classList.add("reveal");
            observer.observe(target);
          }
        });
    }
    observe();
    const mutations = new MutationObserver(observe);
    mutations.observe(element, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutations.disconnect();
      element
        .querySelectorAll(".reveal:not(.is-visible)")
        .forEach((target) => target.classList.remove("reveal"));
    };
  }, [dependency]);
  return root;
}
