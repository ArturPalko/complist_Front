import React from "react";
import s from "../TableWrapper.module.css"

const ColNumbers = ({ pageData, colNumbersRef }) => {
  return (
    <div className={s.colNumbers}>
      {pageData.map((_, i) => (
        <div
          key={i}
          ref={(el) => (colNumbersRef.current[i] = el)}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
};

export default ColNumbers;
