import s from "./ActionButton.module.css";

export default function ActionButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${s.button} ${className}`.trim()}
    >
      {children}
    </button>
  );
}