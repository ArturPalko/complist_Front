import { useState } from "react";
import s from "./AddPosition.module.css";

export default function AddPositionModal({
  onClose,
  onSubmit,
}) {
  const [positionName, setPositionName] = useState("");

  const handleSubmit = () => {
    const value = positionName.trim();

    if (!value) {
      return;
    }

    onSubmit?.(value);
    onClose?.();
  };

  return (
    <div className={s.overlay}>
      <div className={s.modal}>
        <h2 className={s.title}>Додати посаду</h2>

        <label className={s.label}>
          Назва посади
        </label>

        <input
          className={s.input}
          type="text"
          value={positionName}
          onChange={(e) => setPositionName(e.target.value)}
          placeholder="Введіть назву посади"
          autoFocus
        />

        <div className={s.actions}>
          <button
            className={s.cancelButton}
            onClick={onClose}
          >
            Скасувати
          </button>

          <button
            className={s.okButton}
            onClick={handleSubmit}
          >
            ОК
          </button>
        </div>
      </div>
    </div>
  );
}