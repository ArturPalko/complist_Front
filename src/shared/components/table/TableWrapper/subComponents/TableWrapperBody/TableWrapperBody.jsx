import { useEffect } from "react";

import { IndexCell } from "../../../../cell/IndexCell/IndexCell";

import {
  useDragContext,
  useFoundResults,
} from "../../../../../../redux/contexts/useConetxt";

import {
  getDragProps,
  createDragPreview,
  cleanupDragPreview,
  getClassName,
} from "./tableWrapperBody_helpers";

import "./dragAndDrop.css";

import { DropZone } from "../DropZone/DropZone";

import { withDropZones } from "../../../../../hooks/withDropedThones";
import { entityMap } from "../../../../../../configs/app/enitiyMap";

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
  currentMode,
  showDropZones,
  onTopDrop,
  onBottomDrop,
}) => {
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
    isDragDisabled1,
  } = useDragContext();

  const { foundResults } = useFoundResults();

  useEffect(() => {
    if (!setFoundResults) return;

    setFoundResults(foundResults);
  }, [foundResults, setFoundResults]);

  return (
    <tbody className={dragIds.length ? "dragging" : ""}>
      <DropZone
        position="top"
        onDrop={onTopDrop}
        showDropZones={showDropZones}
      />

      {pageData?.map((item, index) => {
        const itemId =
          item?.[entityMap?.[item?.type]?.id] ?? item?.id;

        const itemKey = `${item.type}-${itemId}`;

        const isSelected = selectedIds.includes(itemId);
        const isDragging = dragIds.includes(itemId);

        const isFirst = index === 0;
        const isLast = index === pageData.length - 1;

        return (
          <tr
            key={itemKey}
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
              isDragDisabled1,
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
                isDragDisabled1,
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

      <DropZone
        position="bottom"
        onDrop={onBottomDrop}
        showDropZones={showDropZones}
      />
    </tbody>
  );
};

export default withDropZones(TableWrapperBody);