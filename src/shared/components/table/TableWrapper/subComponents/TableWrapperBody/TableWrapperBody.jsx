import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { IndexCell } from "../../../../cell/IndexCell/IndexCell";

import {
  useDragContext,
  useFoundResults,
} from "../../../../../../redux/contexts/useConetxt";

import {
  activeMenu,
  isEditModeSelected,
  currentPageByMenu,
  isSectionsMode,
  getCurrentMode,
} from "../../../../../../redux/selectors/selector";

import {
  getDragProps,
  createDragPreview,
  cleanupDragPreview,
} from "./tableWrapperBody_helpers";

import "./dragAndDrop.css";

import { getClassName } from "./tableWrapperBody_helpers";

import { rowsPerPage } from "../../../../../../configs/app/constants";

import { withDropZones } from "../../../../../hooks/withDropedThones";

const TableWrapperBody = ({
  pageData,
  rowRefs,
  renderRowCells,
  getRowClass,
  rowClassParams,
  menu,
  editMode,
  page,
  dispatch,
  isSections,
  currentMode
}) => {
  // const dispatch = useDispatch();

  // const isSections = useSelector(isSectionsMode);
  // const menu = useSelector(activeMenu);
  // const currentMode = useSelector(getCurrentMode);

  // const { foundResults } = useFoundResults();

  // const page = useSelector((state) =>
  //   currentPageByMenu(state, menu)
  // );

  // const editMode = useSelector(isEditModeSelected);
// debugger
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
    setDropTargetId,
  } = useDragContext();




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

        const isFirst = index === 0;
        const isLast = index === pageData.length - 1;

        return (
          <tr
            key={itemId}
            {...getDragProps({
              editMode,
              itemId,
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
              isSections,
              menu,
              currentMode,
            })}
            className={`
              ${getClassName({
                index,
                rowClassParams,
                editMode,
                isDragging,
                isSelected,
                getRowClass,
                itemId,
                dropTargetId,
                elementsAfterSelectedIds,
                elementsBeforeSelectedIds,
                selectedIds,
                menu,
                currentMode,
                isSections,
                itemType: item.type,
              })}

              ${isFirst ? "edgeDropTop" : ""}
              ${isLast ? "edgeDropBottom" : ""}
            `}
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

export default withDropZones(TableWrapperBody);