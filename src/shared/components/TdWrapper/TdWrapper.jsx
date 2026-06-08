import { useState } from "react";
import s from "./TdWrapper.module.css";

export const TdWrapper = ({
  children,
  value,
  tableUI,
  className = "",
  colSpan,
  isHeaderRow = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const canCopy =
    value !== null &&
    value !== undefined &&
    String(value).trim() !== "";

  return (
    <td
      colSpan={colSpan}
      className={`${s.td} ${className}`}
      style={
        isHeaderRow
          ? { padding: 5 }
          : undefined
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={s.tdInner}>
        {children}
      </div>

      {isHovered && canCopy && (
        <span
          className={s.icon}
          onClick={async () => {
            const ok = await tableUI.copyToClipboard(value);

            if (ok) {
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 800);
            }
          }}
        >
          📋
        </span>
      )}

      {isCopied && (
        <span className={s.copied}>
          ✅
        </span>
      )}
    </td>
  );
};