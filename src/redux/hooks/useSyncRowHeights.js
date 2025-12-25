import { useEffect } from "react";

export const useRowHeights = (rowRefs, colNumbersRef, headerRef, titleRef, containerRef, deps = []) => {
  useEffect(() => {
    if (!rowRefs.current) return;

    const sync = () => {
      requestAnimationFrame(() => { // гарантуємо, що браузер промалював DOM
        rowRefs.current.forEach((row, i) => {
          const target = colNumbersRef.current[i];
          if (!row || !target) return;

          target.style.height = row.offsetHeight + "px";

          if (i === 0) {
            const headerHeight = headerRef.current?.offsetHeight || 0;
            const titleHeight = titleRef.current?.offsetHeight || 0;
            target.style.marginTop = `${headerHeight + titleHeight}px`;
          } else {
            target.style.marginTop = "0px";
          }
        });
      });
    };

    // Початковий виклик
    sync();

    // ResizeObserver на рядках
    const rowObservers = rowRefs.current.map(row => {
      if (!row) return null;
      const observer = new ResizeObserver(sync);
      observer.observe(row);
      return observer;
    });

    // ResizeObserver на header і title
    const headerObserver = headerRef.current ? new ResizeObserver(sync) : null;
    const titleObserver = titleRef.current ? new ResizeObserver(sync) : null;
    headerObserver?.observe(headerRef.current);
    titleObserver?.observe(titleRef.current);

    // ResizeObserver на контейнер (щоб спрацювало при toggle, фільтрі, scroll)
    const containerObserver = containerRef?.current ? new ResizeObserver(sync) : null;
    containerObserver?.observe(containerRef.current);

    // Window resize
    window.addEventListener("resize", sync);

    // Очистка
    return () => {
      window.removeEventListener("resize", sync);
      rowObservers.forEach(o => o && o.disconnect());
      headerObserver?.disconnect();
      titleObserver?.disconnect();
      containerObserver?.disconnect();
    };
  }, deps);
};
