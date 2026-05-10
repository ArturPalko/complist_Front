import {
  getDragClass,
  getDropPositionClass,
} from "../../helpers";

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
}) => {
  const isCurrentDropTarget = dropTargetId === itemId;

const isAfter = isCurrentDropTarget && elementsAfterSelectedIds?.includes(itemId);
const isBefore = isCurrentDropTarget && elementsBeforeSelectedIds?.includes(itemId);

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
}) => {
  if (!editMode) return {};

  return {
    draggable: true,

    /* =========================
       DRAG START
    ========================= */
    onDragStart: (e) => {
      startDrag(itemId);

      const preview = createDragPreview(item, selectedIds);

      e.dataTransfer.setDragImage(preview, 0, 0);

      e.currentTarget._dragPreview = preview;
    },

    /* =========================
       DRAG OVER (ONLY SOURCE OF TRUTH)
    ========================= */
    onDragOver: (e) => {
      if (isOnFoundResultsPage) return;

      e.preventDefault();

      // 🔥 єдине місце де міняємо drop target
      setDropTargetId?.(itemId);
    },

    /* =========================
       DROP
    ========================= */
    onDrop: (e) => {
      setDropTargetId?.(null);

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
    : `📄 ${item.mailName}`;
};


export const cleanupDragPreview = (el) => {
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
};