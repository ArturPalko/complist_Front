import s from "./PasswordField.module.css";
import form from "../../../../../shared/Css/form.module.css"
export default function PasswordField({
  isEdit,
  password,
  passwordKnown,
  showPassword,
  setPassword,
  setPasswordKnown,
  handleShowPassword,
}) {
  return (
    <div className={s.wrapper}>
      <label className={form.label}>
        Пароль
      </label>

      {!isEdit && (
        <>
          <label className={s.checkboxRow}>
            <input
              type="checkbox"
              checked={passwordKnown}
              onChange={(e) =>
                setPasswordKnown(e.target.checked)
              }
            />

            Пароль відомий
          </label>

          {passwordKnown && (
            <input
              className={`${form.input} ${form.focusGray}`}
              value={password}
              placeholder="Введіть пароль"
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          )}
        </>
      )}

      {isEdit && (
        <>
          <div className={s.passwordRow}>
            <input
              type="checkbox"
              checked={passwordKnown}
              disabled
            />

            <button
              type="button"
              onClick={handleShowPassword}
            >
              {showPassword
                ? "Сховати"
                : "Показати"}
            </button>
          </div>

          {showPassword && (
            <input
              className={`${form.input} ${form.focusGray}`}
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          )}
        </>
      )}
      </div>
   
  );
}