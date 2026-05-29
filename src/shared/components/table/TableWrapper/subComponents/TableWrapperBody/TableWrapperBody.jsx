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

const TableWrapperBody = ({
  pageData,
  rowRefs,
  renderRowCells,
  getRowClass,
  rowClassParams,
}) => {
  const dispatch = useDispatch();

  const isSections = useSelector(isSectionsMode);
  const menu = useSelector(activeMenu);
  const currentMode = useSelector(getCurrentMode);

  const { foundResults } = useFoundResults();

  const page = useSelector((state) =>
    currentPageByMenu(state, menu)
  );

  const editMode = useSelector(isEditModeSelected);
debugger
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

  useEffect(() => {
    if (!setFoundResults) return;
    setFoundResults(foundResults);
  }, [foundResults, setFoundResults]);


  return (
    <tbody className={dragIds.length ? "dragging" : ""}>

      {/* 🔥 TOP DROP ZONE (before first row) */}
      {editMode && pageData?.length > 0 && (
        <tr
          className="edgeDropTopRow"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleDrop(-1, page);
          }}
        >
          <td colSpan={999} />
        </tr>
      )}

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

      {/* 🔥 BOTTOM DROP ZONE (after last row) */}
      {editMode && pageData?.length > 0 && (
        <tr
          className="edgeDropBottomRow"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleDrop(pageData.length, page);
          }}
        > 
          <td colSpan={999} />
        </tr>
      )}
    </tbody>
  );
};

export default TableWrapperBody;