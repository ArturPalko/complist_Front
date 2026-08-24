import { useRef, useState } from "react";

export const useTooltipPlacement = () => {
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  const [isBottom, setIsBottom] = useState(false);

  const updatePlacement = () => {
    if (!triggerRef.current || !tooltipRef.current) {
      return;
    }

    requestAnimationFrame(() => {
      if (!triggerRef.current || !tooltipRef.current) {
        return;
      }

      const triggerRect =
        triggerRef.current.getBoundingClientRect();

      const tooltipRect =
        tooltipRef.current.getBoundingClientRect();

      const topSpace = triggerRect.top;

      const bottomSpace =
        window.innerHeight - triggerRect.bottom;

      setIsBottom(
        topSpace < tooltipRect.height &&
        bottomSpace > topSpace
      );
    });
  };

  return {
    triggerRef,
    tooltipRef,
    isBottom,
    updatePlacement,
  };
};