import React from "react";

const TableWrapperBody = ({
  pageData,
  rowRefs,
  renderRowCells,
  renderIndexCell = () => null,
  getRowClass,
  rowClassParams
}) => (
  <tbody>
    {pageData.map((item, index) => (
      <tr
        key={item.id || index}
        className={getRowClass({ index, ...rowClassParams })}
        data-key={index}
        ref={(el) => rowRefs?.current && (rowRefs.current[index] = el)}
      >
        {renderIndexCell(index)}
        {renderRowCells(item, index)}
      </tr>
    ))}
  </tbody>
);

export default TableWrapperBody;
