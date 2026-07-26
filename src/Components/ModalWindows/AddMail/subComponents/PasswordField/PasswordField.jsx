import s from "./PasswordField.module.css";

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
    <div className={s.field}>
      <label className={s.label}>
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
              className={s.input}
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
              className={s.input}
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