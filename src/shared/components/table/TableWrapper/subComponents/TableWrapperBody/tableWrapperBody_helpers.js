import {
  getDragClass,
  getDropPositionClass,
} from "../../helpers";
import { setActiveDepartment } from "../../../../../../redux/reducers/ui-reducer";

/* =========================
   CLASS NAME
========================= */

export const getClassName = ({
  itemId,
  index,
  rowClassParams,

  editMode,
  isDragging,
  isSelected,

  getRowClass,

  dropTargetId,
  elementsBeforeSelectedIds,
  elementsAfterSelectedIds,
  selectedIds = [],
}) => {
  const isCurrentDropTarget = dropTargetId === itemId;

  const isSelectedItem = selectedIds.includes(itemId);

  const isAfter =
    isCurrentDropTarget &&
    !isSelectedItem &&
    elementsAfterSelectedIds?.includes(itemId);

  const isBefore =
    isCurrentDropTarget &&
    !isSelectedItem &&
    elementsBeforeSelectedIds?.includes(itemId);

  return [
    getRowClass({ index, ...rowClassParams }),

    getDragClass({
      editMode,
      isDragging,
      isSelected,
    }),

    getDropPositionClass({
      isAfter,
      isBefore,
    }),
  ]
    .filter(Boolean)
    .join(" ");
};
/* =========================
   DRAG PROPS
========================= */

export const getDragProps = ({
  editMode,
  itemId,
  item,
  selectedIds,
  index,
  page,
  startDrag,
  handleDrop,
  toggleSelect,
  stopDrag,
  isOnFoundResultsPage,
  endDrag,
  setDropTargetId,
  dispatch,
  isSections
}) => {
  if (!editMode) return {};

  return {
    draggable: true,

    /* =========================
       DRAG START
    ========================= */
    onDragStart: (e) => {
        // toggleSelect(itemId, e);
      startDrag(itemId);
      debugger
      console.log ("selectedIds3:", selectedIds)
      const preview = createDragPreview(item, selectedIds);

      e.dataTransfer.setDragImage(preview, 0, 0);

      debugger
      e.currentTarget._dragPreview = preview;
      debugger
    },

    /* =========================
       DRAG OVER (ONLY SOURCE OF TRUTH)
    ========================= */
    onDragOver: (e) => {
      // debugger
      if (isOnFoundResultsPage) return;

      e.preventDefault();

      // 🔥 єдине місце де міняємо drop target
      setDropTargetId?.(itemId);
      // debugger
    },

    onDragLeave: (e) => {

      setDropTargetId?.(null);
    },

    /* =========================
       DROP
    ========================= */
    onDrop: (e) => {
      // debugger
      setDropTargetId?.(null);
// debugger
      handleDrop(index, page);
    },

    /* =========================
       DRAG END
    ========================= */
    onDragEnd: (e) => {
      setDropTargetId?.(null);

      endDrag();

      cleanupDragPreview(e.currentTarget._dragPreview);
      e.currentTarget._dragPreview = null;

      stopDrag?.();
    },

    /* =========================
       CLICK SELECT
    ========================= */
onClick: (e) => {
 debugger
  if (
    isSections &&
    item?.type === "department"
  ) {
    // debugger
    dispatch(setActiveDepartment(item.departmentId));
    return;
  }
debugger
  toggleSelect(itemId, e);
},
  };
};

/* =========================
   DRAG PREVIEW
========================= */

// import { getDragPreviewHTML } from "./dragPreviewTemplate";

export const createDragPreview = (
  item,
  selectedIds
) => {
  const el = document.createElement("div");

  el.className = "drag-preview";

  el.innerHTML = getDragPreviewHTML({
    item,
    selectedIds,
  });

  document.body.appendChild(el);

  return el;
};


// dragPreviewTemplate.js

export const getDragPreviewHTML = ({
  item,
  selectedIds,
}) => {
  const isMultiple = selectedIds.length > 1;

  return isMultiple
    ? `📦 ${selectedIds.length} елементи`
    : `📄 ${item.name || item.mailName || item.departmentName || item.SectionName}`;
};


export const cleanupDragPreview = (el) => {
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
};


