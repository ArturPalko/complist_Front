import { useEffect } from "react";

export const useRowHeights = (
  rowRefs,
  colNumbersRef,
  headerRef,
  titleRef,
  deps = []
) => {
  useEffect(() => {
    if (!rowRefs.current) return;

    const sync = () => {
      // Використовуємо setTimeout, щоб чекати поки DOM повністю змонтований
      setTimeout(() => {
        const headerHeight = headerRef.current?.offsetHeight || 0;
        const titleHeight = titleRef.current?.offsetHeight || 0;

        rowRefs.current.forEach((row, i) => {
          const target = colNumbersRef.current[i];
          if (!row || !target) return;

          // Встановлюємо висоту
          target.style.height = row.offsetHeight + "px";

          if (i === 0) {
            target.style.marginTop = `${headerHeight + titleHeight}px`;
          } else {
            target.style.marginTop = `0px`;
          }
        });
      }, 0);
    };

    sync();

    // ResizeObserver для рядків
    const rowObservers = rowRefs.current.map((row) => {
      if (!row) return null;
      const observer = new ResizeObserver(sync);
      observer.observe(row);
      return observer;
    });

    // ResizeObserver для header і title
    const headerObserver = headerRef.current ? new ResizeObserver(sync) : null;
    const titleObserver = titleRef.current ? new ResizeObserver(sync) : null;

    headerObserver?.observe(headerRef.current);
    titleObserver?.observe(titleRef.current);

    // Window resize
    window.addEventListener("resize", sync);

    // Очистка
    return () => {
      window.removeEventListener("resize", sync);
      rowObservers.forEach((o) => o && o.disconnect());
      headerObserver?.disconnect();
      titleObserver?.disconnect();
    };
  }, deps);
};
