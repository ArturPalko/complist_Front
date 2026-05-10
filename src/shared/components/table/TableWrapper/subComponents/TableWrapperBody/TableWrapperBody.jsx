import { useSelector } from "react-redux";
import { useEffect } from "react";
import { getRowClass } from "../../helpers";

import { IndexCell } from "../../../../cell/IndexCell/IndexCell";
import {
  useDragContext,
  useFoundResults
} from "../../../../../../redux/contexts/useConetxt";

import {
  activeMenu,
  isEditModeSelected,
  currentPageByMenu,
} from "../../../../../../redux/selectors/selector";

import {
  getDragProps,
  createDragPreview,
  cleanupDragPreview,
} from "./tableWrapperBody_helpers";

import "./dragAndDrop.css";
import { getClassName } from "./tableWrapperBody_helpers";

const TableWrapperBody = ({
  pageData,
  rowRefs,
  renderRowCells,
  getRowClass,
  rowClassParams,
}) => {
  const menu = useSelector(activeMenu);
  const { foundResults } = useFoundResults();

  const page = useSelector((state) =>
    currentPageByMenu(state, menu)
  );

  const editMode = useSelector(isEditModeSelected);

  const {
    dragIds,
    selectedIds,
    toggleSelect,
    startDrag,
    handleDrop,
    elementsAfterSelectedIds,
    elementsBeforeSelectedIds,
    endDrag,
    setFoundResults,
    isOnFoundResultsPage,
     dropTargetId,
     setDropTargetId
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

        return (
          <tr
            key={item.id}
            {...getDragProps({
              editMode,
              itemId: item.id,
              item,
              selectedIds,
              index,
              page,
              startDrag,
              handleDrop,
              toggleSelect,
              elementsAfterSelectedIds,
              elementsBeforeSelectedIds,
              isOnFoundResultsPage,
              endDrag,
              createDragPreview,
              cleanupDragPreview,
              setDropTargetId,
              dropTargetId
            })}
              className={getClassName({
                    index,
                    rowClassParams,
                    editMode,
                    isDragging,
                    isSelected,
                    getRowClass,
                    itemId: item.id,
                    dropTargetId,
                    elementsAfterSelectedIds,
                    elementsBeforeSelectedIds
                  })}
            data-key={index}
            ref={(el) =>
              rowRefs?.current &&
              (rowRefs.current[index] = el)
            }
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