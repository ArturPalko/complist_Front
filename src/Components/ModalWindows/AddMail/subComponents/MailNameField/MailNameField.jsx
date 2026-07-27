import { useState } from "react";
import s from "./MailNameField.module.css";

export default function MailNameField({
  value,
  onChange,
  oldValue,
  onOldChange,
  showOldField,
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
          <button
            type="button"
            className={`${s.flipButton} ${
              showOldName ? s.open : ""
            }`}
            onClick={() =>
              setShowOldName(prev => !prev)
            }
          >
            ⇄
          </button>
        )}

      </div>

      <div className={s.flipContainer}>

        <div
          className={`${s.flipCard} ${
            showOldName ? s.flipped : ""
          }`}
        >

          <div className={s.front}>
            <input
              className={s.input}
              value={value}
              onChange={e =>
                onChange(e.target.value)
              }
            />
          </div>

          <div className={s.back}>
            <input
              className={s.input}
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