import s from "../TableWrapper.module.css"
const TableWrapperHead = ({shouldRenderIndexesHeader, headerRef, renderHeader }) => {
 
  return (
    <thead ref={headerRef}>
      <tr>
        {shouldRenderIndexesHeader && (
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
