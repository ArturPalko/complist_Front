import s from "./SectionsPreview.module.css";

const SectionsPreview = ({ sections = [] }) => {
  if (!sections.length) {
    return (
      <span className={s.empty}>
        Без секції
      </span>
    );
  }
const label =
  sections.length === 1
    ? sections[0].name
    : "Кілька відповідальних підрозділів";

  return (
    <div className={s.wrapper}>
      <span className={s.label}>
        {label}
      </span>

      {sections.length > 1 && (
        <div className={s.tooltip}>
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
      )}
    </div>
  );
};

export default SectionsPreview;