import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import s from "./Error.module.css";

const Error = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Якщо повідомлення передане через state, використовуємо його, інакше дефолт
  const message = location.state?.message || "Сталася помилка!";

  const handleBack = () => {
    navigate(-1); // повертаємося на попередню сторінку
  };

  return (
    <div className={s.container}>
      <div className={s.card}>
        <h1 className={s.title}>Oops!</h1>
        <p className={s.message}>{message}</p>
        <button className={s.button} onClick={handleBack}>
          Назад
        </button>
      </div>
    </div>
  );
};

export default Error;
