import { useNavigate } from "react-router-dom";
import s from "./Error.module.css";

const Error = () => {
  const navigate = useNavigate();
 

  const message =  "Перевищено час отримання даних із сервера!";

  const handleBack = () => {
    navigate(-1); 
  };

  return (
    <div className={s.container}>
      <div className={s.card}>
        <h1 className={s.title}>Упс!</h1>
        <p className={s.message}>{message}</p>
        <button className={s.button} onClick={handleBack}>
          Спробувати ще раз
        </button>
      </div>
    </div>
  );
};

export default Error;
