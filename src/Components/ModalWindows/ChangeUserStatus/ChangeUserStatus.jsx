import React from "react";
import s from "./ChangeUserStatus.module.css";


export default function ChangeUserStatus({
  onConfirm,
  onClose,
}) {
  return (
    <div className={s.overlay}>
      <div className={s.modal}>
      {/* HEADER */}

      <div className={s.header}>
        <div>
          <div className={s.title}>
            Зміна статусу
          </div>

          <div className={s.subtitle}>
            Керування статусом користувачів
          </div>
        </div>

        <button
          type="button"
          className={s.close}
          onClick={onClose}
        >
          ×
        </button>
      </div>

      {/* CONTENT */}

      <div className={s.content}>
        <div className={s.question}>
          Змінити статус вибраних користувачів?
        </div>
      </div>

      {/* FOOTER */}

      <div className={s.footer}>
        <button
          type="button"
          className={s.cancelButton}
          onClick={onClose}
        >
          Скасувати
        </button>

        <button
          type="button"
          className={s.confirmButton}
          onClick={onConfirm}
        >
          Змінити статус
        </button>
      </div>
      </div>
    </div>
  );
}