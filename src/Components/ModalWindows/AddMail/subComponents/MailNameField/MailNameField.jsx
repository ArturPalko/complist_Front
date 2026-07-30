import { useState } from "react";
import s from "./MailNameField.module.css";
import form  from "../../../../../shared/Css/form.module.css"

export default function MailNameField({
  value,
  onChange,
  oldValue,
  onOldChange,
  showOldField,
  autoUpdatePreviousName,
  setAutoUpdatePreviousName,
}) {
  const [showOldName, setShowOldName] = useState(false);

  return (
    <div className={s.field}>
      <div className={s.header}>

        <label className={s.label}>
          {showOldName
            ? "Попередня назва"
            : "Нова назва"}
        </label>

        {showOldField && (
          <div className={s.controls}>

            <button
              type="button"
              className={`${s.flipButton} ${
                showOldName ? s.open : ""
              }`}
              onClick={() =>
                setShowOldName(prev => !prev)
              }
              title="Перемич поперендя/нова назва"
            >
              ↔

              {oldValue && (
                <span className={s.badge} />
              )}
            </button>

            <button
              type="button"
              className={`${s.autoButton} ${
                autoUpdatePreviousName
                  ? s.autoOn
                  : ""
              }`}
              onClick={() =>
                setAutoUpdatePreviousName(
                  prev => !prev
                )
              }
              title="Автоматично переносити нову назву в попередню"
            >
              Auto
            </button>

          </div>
        )}

      </div>

      <div className={s.flipContainer}>

        <div
          className={`${s.flipCard} ${
            showOldName
              ? s.flipped
              : ""
          }`}
        >

          <div className={s.front}>
            <input
              className={`${form.input} ${form.focusBlue}`}
              value={value}
              onChange={e =>
                onChange(e.target.value)
              }
            />
          </div>

          <div className={s.back}>
            <input
              className={`${form.input} ${form.focusBlue}`}
              value={oldValue}
              onChange={e =>
                onOldChange(e.target.value)
              }
            />
          </div>

        </div>

      </div>

    </div>
  );
}