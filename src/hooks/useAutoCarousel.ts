import { useEffect, useState } from "react";
export const CAROUSEL_INTERVAL = 5000;
export function useAutoCarousel(length: number) {
  const [index, setIndex] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => setReducedMotion(media.matches);
    const onVisibilityChange = () => setHidden(document.hidden);
    media.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      media.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);
  const paused = stopped || hovering || focused || hidden || reducedMotion;
  useEffect(() => {
    if (paused || length < 2) return;
    const timer = window.setTimeout(
      () => setIndex((current) => (current + 1) % length),
      CAROUSEL_INTERVAL,
    );
    return () => window.clearTimeout(timer);
  }, [index, length, paused]);
  return {
    index,
    setIndex,
    paused,
    stopped,
    setStopped,
    setHovering,
    setFocused,
    reducedMotion,
  };
}
