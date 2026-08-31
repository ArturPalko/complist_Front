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
  currentMode,
  menu,
  isSections,
  itemType,
  isDragDisabled1
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
      currentMode,
      menu,
      isSections,
      itemType,
      isDragDisabled1
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
  isSections,
  menu,
  currentMode,
  isDragDisabled1,
}) => {

  if (menu === "phones" && !currentMode) {
    return {
      onClick: (e) => {
        toggleSelect(itemId, e);
      },
    };
  }

  /* =========================
     CLICK — ЗАВЖДИ
  ========================= */

  const baseProps = {
    onClick: (e) => {
      toggleSelect(itemId, e);
    },
  };

  /* =========================
     DRAG DISABLED
  ========================= */

  const isDragDisabled =
    !editMode ||
    (
      isSections &&
      item?.type === "department"
    ) ||
    isDragDisabled1;

  /* =========================
     NO DRAG
  ========================= */

  if (isDragDisabled) {
    return baseProps;
  }

  /* =========================
     DRAG ENABLED
  ========================= */

  return {
    ...baseProps,

    draggable: true,

    onDragStart: (e) => {
      startDrag(itemId);

      const preview =
        createDragPreview(item, selectedIds);

      e.dataTransfer.setDragImage(
        preview,
        0,
        0
      );

      e.currentTarget._dragPreview =
        preview;
    },

    onDragOver: (e) => {
      if (isOnFoundResultsPage) return;

      e.preventDefault();

      setDropTargetId?.(itemId);
    },

    onDragLeave: () => {
      setDropTargetId?.(null);
    },

    onDrop: () => {
      setDropTargetId?.(null);

      handleDrop(index, page);
    },

    onDragEnd: (e) => {
      setDropTargetId?.(null);

      endDrag();

      cleanupDragPreview(
        e.currentTarget._dragPreview
      );

      e.currentTarget._dragPreview = null;

      stopDrag?.();
    },
  };
};
/* =========================
   DRAG PREVIEW
========================= */

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
//          
  return el;
};

/* =========================
   PREVIEW HTML
========================= */

export const getDragPreviewHTML = ({
  item,
  selectedIds,
}) => {
  const isMultiple =
    selectedIds.length > 1;

  return isMultiple
    ? `📦 ${selectedIds.length} елементи`
    : `📄 ${
        item.name ||
        item.mailName ||
        item.departmentName ||
        item.sectionName ||
        item.positionName ||
        item.userType
      }`;
};

/* =========================
   CLEANUP
========================= */

export const cleanupDragPreview = (el) => {
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
};


export const copyToClipboard = async (value) => {
  try {
    await navigator.clipboard.writeText(String(value));
    return true;
  } catch (e) {
    console.error("Copy failed:", e);
    return false;
  }
};