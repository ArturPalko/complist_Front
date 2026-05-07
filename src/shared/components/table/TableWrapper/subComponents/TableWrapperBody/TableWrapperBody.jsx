import { useSelector } from "react-redux";
import { IndexCell } from "../../../../cell/IndexCell/IndexCell";
import { useDragContext, useFoundResults } from "../../../../../../redux/contexts/useConetxt";
import {
  activeMenu,
  isEditModeSelected,
  currentPageByMenu,
} from "../../../../../../redux/selectors/selector";

import {
  getEditStyle,
  getDragProps,
  createDragPreview,
  cleanupDragPreview,
} from "./tableWrapperBody_helpers";
import { useEffect } from "react";

const TableWrapperBody = ({
  pageData,
  rowsPerPage,
  rowRefs,
  renderRowCells,
  getRowClass,
  rowClassParams,
}) => {
  const menu = useSelector(activeMenu);
    const {foundResults} = useFoundResults();

  const page = useSelector((state) => currentPageByMenu(state, menu));
  const editMode = useSelector(isEditModeSelected);
    
  

  const {
    dragIds,
    selectedIds,
    toggleSelect,
    startDrag,
    handleDrop,
    elementsAfterSelectedIds,
    elementsBeforeSelectedIds,
    setDragIds,
    endDrag,
    setFoundResults,
    isOnFoundResultsPage
  } = useDragContext();

useEffect(() => {
  if (!setFoundResults) return;

  setFoundResults(foundResults);
}, [foundResults, setFoundResults]);


  return (
    <tbody className={dragIds.length ? "dragging" : ""}>
      {pageData?.map((item, index) => {
        const isSelected = selectedIds.includes(item.id);
        const isDragging = dragIds.includes(item.id);

        const dragProps = {
          ...getDragProps({
            editMode,
            itemId: item.id,
            index,
            page,
            startDrag,
            handleDrop,
            toggleSelect,
            elementsAfterSelectedIds,
            elementsBeforeSelectedIds,
            isOnFoundResultsPage
          }),

          onDragStart: (e) => {
            startDrag(item.id);

            const preview = createDragPreview(item, selectedIds);
            e.dataTransfer.setDragImage(preview, 0, 0);

            e.currentTarget._dragPreview = preview;
          },

        onDragEnd: (e) => {
            cleanupDragPreview(e.currentTarget._dragPreview);
            e.currentTarget._dragPreview = null;
            endDrag()
          }
        };

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
              isNonUserRowType={item?.type ? item.type !== "user" : false}
              isSectionType={item?.type ? item.type === "section" : false}
            />

            {renderRowCells(item, index)}
          </tr>
        );
      })}
    </tbody>
  );
};

export default TableWrapperBody;