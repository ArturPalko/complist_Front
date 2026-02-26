import {IndexCell} from "../../../cell/IndexCell/IndexCell"

const TableWrapperBody = ({
  pageData,
  rowRefs,
  renderRowCells,
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
        <IndexCell
  index={index}
  isNonUserRowType={item?.type ? item.type !== "user" : false}
/>
        {renderRowCells(item, index)}
      </tr>
    ))}
  </tbody>
);

export default TableWrapperBody;
