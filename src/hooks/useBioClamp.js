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

      // 1) лише читання: один layout на всю фазу
      container.querySelectorAll(".tutor-card__bio").forEach((bio) => {
        const rect = bio.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < viewportHeight) {
          // bio вже має is-clamped: scrollHeight = повний текст, clientHeight = 3 рядки
          measured.push([bio, bio.scrollHeight > bio.clientHeight + 1]);
        }
      });

      // 2) лише запис
      measured.forEach(([bio, hasMore]) => {
        bio.parentElement
          .querySelector(".tutor-card__more")
          .classList.toggle("is-visible", hasMore);
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update(); // синхронно до першого paint, як і раніше
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, deps);
}
