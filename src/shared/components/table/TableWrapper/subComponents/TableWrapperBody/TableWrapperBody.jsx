import { useSelector } from "react-redux";
import { IndexCell } from "../../../../cell/IndexCell/IndexCell";
import { useDragContext } from "../../../../../../redux/contexts/useConetxt";
import { activeMenu, isEditModeSelected } from "../../../../../../redux/selectors/selector";
import { currentPageByMenu } from "../../../../../../redux/selectors/selector";
import { getEditStyle,getDragProps } from "./tableWrapperBody_helpers";

const TableWrapperBody = ({
  pageData,
  rowsPerPage,
  rowRefs,
  renderRowCells,
  getRowClass,
  rowClassParams,
}) => {

  const menu = useSelector(activeMenu);
  const page = useSelector((state) =>
    currentPageByMenu(state, menu))
  const editMode = useSelector(isEditModeSelected);

  const {
    dragIds,
    selectedIds,
    toggleSelect,
    startDrag,
    handleDrop,
  } = useDragContext();


  return (
    <tbody>
      {pageData?.map((item, index) => {
        const isSelected = selectedIds.includes(item.id);
        const isDragging = dragIds.includes(item.id);
        const dragProps = getDragProps({
        editMode,
        itemId: item.id,
        index,
        page,
        startDrag,
        handleDrop,
        toggleSelect,
      });
        return (
          <tr
          {...dragProps}
            key={item.id}
            className={getRowClass({ index, ...rowClassParams })}
            data-key={index}
            ref={(el) =>
              rowRefs?.current && (rowRefs.current[index] = el)
            }
            style={getEditStyle({ editMode, isDragging, isSelected })}
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
        );
      })}
    </tbody>
  );
};

export default TableWrapperBody;