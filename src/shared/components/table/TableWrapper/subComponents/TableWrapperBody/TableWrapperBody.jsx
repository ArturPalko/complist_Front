import { useDispatch, useSelector } from "react-redux";
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
  isSectionsMode,
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
  const dispatch = useDispatch();
  const isSections = useSelector(isSectionsMode)
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
        const itemId =
  item?.type === "department"
    ? item.departmentId
    : item?.type === "section"
      ? item.sectionId
      : item?.id;
        const isSelected = selectedIds.includes(itemId);
        const isDragging = dragIds.includes(itemId);
// console.log ("itemId:", itemId)
        return (
          <tr
            key={itemId}
            {...getDragProps({
              editMode,
              itemId: itemId,
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
              dropTargetId,
              dispatch,
              isSections
            })}
              className={getClassName({
                    index,
                    rowClassParams,
                    editMode,
                    isDragging,
                    isSelected,
                    getRowClass,
                    itemId: itemId,
                    dropTargetId,
                    elementsAfterSelectedIds,
                    elementsBeforeSelectedIds,
                    selectedIds
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



