import { useState } from "react";
import s from "./SectionsPreview.module.css";
import { useTooltipPlacement } from "../../../../../../redux/hooks/useToolTipPlacement";

const SectionsPreview = ({
  sections = [],
  ownerDisplayName = "",
}) => {
  const [expanded, setExpanded] = useState(false);

  const {
    triggerRef,
    tooltipRef,
    isBottom,
    updatePlacement,
  } = useTooltipPlacement();

  if (!sections.length) {
    return (
      <span className={s.empty}>
        Без секції
      </span>
    );
  }

  if (sections.length === 1) {
    return (
      <span className={s.label}>
        {sections[0].name}
      </span>
    );
  }

  const handleToggle = () => {
    if (!expanded) {
      updatePlacement();
    }

    setExpanded((prev) => !prev);
  };

  return (
    <div
      ref={triggerRef}
      className={s.wrapper}
    >
      <div className={s.content}>
        {ownerDisplayName && (
          <span className={s.ownerDisplayName}>
            {ownerDisplayName}
          </span>
        )}

        <span className={s.label}>
          Кілька підрозділів власників
        </span>
      </div>

      <button
        type="button"
        className={s.toggleButton}
        onClick={handleToggle}
        aria-label={
          expanded
            ? "Сховати секції"
            : "Показати секції"
        }
      >
        <span
          className={`${s.arrow} ${
            expanded ? s.arrowUp : ""
          }`}
        >
          ▼
        </span>
      </button>

      <div
        ref={tooltipRef}
        className={`${s.tooltip} ${
          isBottom ? s.tooltipDown : ""
        } ${!expanded ? s.tooltipHidden : ""}`}
      >
        <div className={s.tooltipTitle}>
          Секції
        </div>

        <div className={s.list}>
          {sections.map((section) => (
            <div
              key={section.id}
              className={s.item}
            >
              <span className={s.dot} />
              <span>{section.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionsPreview;