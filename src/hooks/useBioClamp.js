import { useLayoutEffect } from "react";

export function useBioClamp(containerRef, deps) {
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const measured = [];
      container.querySelectorAll(".tutor-card__bio").forEach((bio) => {
        const rect = bio.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < viewportHeight) {
          measured.push([bio, bio.scrollHeight > bio.clientHeight + 1]);
        }
      });

      measured.forEach(([bio, hasMore]) => {
        bio.parentElement
          .querySelector(".tutor-card__more")
          .classList.toggle("is-visible", hasMore);
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, deps);
}
