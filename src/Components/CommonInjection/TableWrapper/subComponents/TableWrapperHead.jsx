import React from "react";
import s from "../TableWrapper.module.css"

const TableWrapperHead = ({ headerRef, renderHeader, showIndexes }) => (
  <thead ref={headerRef}>
    <tr>
      {showIndexes?.length > 0 && (
  <th rowSpan="3" className={s.indexesColumnHeader}>
    Індекси
  </th>
)}

    </tr>
    {renderHeader?.()}
  </thead>
);

export default TableWrapperHead;
