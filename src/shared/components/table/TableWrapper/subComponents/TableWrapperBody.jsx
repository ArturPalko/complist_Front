import { useSelector } from "react-redux";
import { IndexCell } from "../../../cell/IndexCell/IndexCell";
import { activeMenu, currentPageByMenu } from "../../../../../redux/selectors/selector";
import { useDragContext } from "../../../../../redux/contexts/useConetxt";

const TableWrapperBody = ({
  pageData,
  rowRefs,
  renderRowCells,
  getRowClass,
  rowClassParams,
  
}) => {
  const menu = useSelector(activeMenu);
   const page = useSelector((state) =>
    currentPageByMenu(state, menu))
   
  // debugger

  const { dragId, startDrag, handleDrop } = useDragContext();

  // 🔥 SAFETY: pageData завжди масив
  const rows = Array.isArray(pageData) ? pageData : [];

  return (
    <tbody>
      {rows.map((item, index) => (
        <tr
          key={item.id}
          className={getRowClass({ index, ...rowClassParams })}
          data-key={index}
          ref={(el) => {
            if (rowRefs?.current) {
              rowRefs.current[index] = el;
            }
          }}
          draggable
          onDragStart={() => startDrag(item.id, { page, index })}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(index, page)}
          style={{
            cursor: "grab",
            opacity: dragId === item.id ? 0.5 : 1,
            userSelect: "none",
          }}
        >
          <IndexCell
            index={index}
            isNonUserRowType={
              item?.type ? item.type !== "user" : false
            }
            isSectionType={
              item?.type ? item.type === "section" : false
            }
          />

          {renderRowCells(item, index)}
        </tr>
      ))}
    </tbody>
  );
};

export default TableWrapperBody;