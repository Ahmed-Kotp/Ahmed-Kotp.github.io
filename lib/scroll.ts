type ScrollTarget = string | number | HTMLElement;

function nativeScroll(target: ScrollTarget) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior: ScrollBehavior = reduced ? "auto" : "smooth";
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior, block: "start" });
}

let current: (target: ScrollTarget) => void = nativeScroll;

export function registerScroller(fn: (target: ScrollTarget) => void) {
  current = fn;
  return () => {
    current = nativeScroll;
  };
}

export function scrollToTarget(target: ScrollTarget) {
  current(target);
}
