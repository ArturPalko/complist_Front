import { useEffect } from "react";

export const useRowHeights = (rowRefs, colNumbersRef, deps = []) => {
  useEffect(() => {
    if (!rowRefs.current?.length) return;

    const sync = () => {
      rowRefs.current.forEach((row, i) => {
        const target = colNumbersRef.current[i];
        if (!row || !target) return;

        const height = row.offsetHeight;
        target.style.height = height + "px";
      });
    };

    // Initial
    sync();

    // Resize observer на кожен рядок
    const observers = rowRefs.current.map((row, i) => {
      if (!row) return null;

      const observer = new ResizeObserver(() => {
        const target = colNumbersRef.current[i];
        if (target) {
          target.style.height = row.offsetHeight + "px";
        }
      });

      observer.observe(row);
      return observer;
    });

    // Window resize
    window.addEventListener("resize", sync);

    return () => {
      window.removeEventListener("resize", sync);
      observers.forEach((o) => o && o.disconnect());
    };
  }, deps);
};
