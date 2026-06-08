import { useState } from "react";
import { copyToClipboard } from "../TableWrapperBody/tableWrapperBody_helpers";
import s from "./CellWithCopy.module.css"

const CellWithCopy = ({ value, children }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();

    const ok = await copyToClipboard(value);

    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 800);
    }
  };

  return (
    <div className={s.cellWrapper}>
      {children ?? value}

      <span className={s.copyIcon} onClick={handleCopy}>
        {copied ? "✓" : "📋"}
      </span>
    </div>
  );
};

export default CellWithCopy;