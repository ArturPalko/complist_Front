import { useState } from "react";
import s from "./TdWrapper.module.css";
import torn_pageImg from "../../../assets/Img/torn_page.png";

export const TdWrapper = ({
  children,
  value,
  tableUI,
  className = "",
  colSpan,
  isHeaderRow = false,
  showBreak = false,
  text
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const canCopy =
    value !== null &&
    value !== undefined &&
    String(value).trim() !== "";

  const handleCopy = async () => {
    const ok = await tableUI.copyToClipboard(value);

    if (ok) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 800);
    }
  };

return (
  <td
    colSpan={colSpan}
    className={`${s.td} ${className}`}
    style={isHeaderRow ? { padding: 5 } : undefined}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
 
    
   <div className= {s.block}> {children} </div>

    {/* break як було раніше */}
    {showBreak && (
      <img
        src={torn_pageImg}
        alt="Розрив"
        className={s.breakImage}
      />
    )}
    

    {isHovered && canCopy && (
      <span className={s.copyIcon} onClick={handleCopy}>
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