import React from "react";
import s from "../TableWrapper.module.css"
const TableWrapperHead = ({ headerRef, renderHeader,indexDataOfFoundResultsForFoundResultsPage }) => {
 const hasIndexes = indexDataOfFoundResultsForFoundResultsPage?.length > 0;
 
  return (
    <thead ref={headerRef}>
      <tr>
        {hasIndexes && (
          <th rowSpan="3" className={s.indexesColumnHeader}>
            Індекси
          </th>
        )}
      </tr>
      {renderHeader?.()}
    </thead>
  );
};

export default TableWrapperHead;
