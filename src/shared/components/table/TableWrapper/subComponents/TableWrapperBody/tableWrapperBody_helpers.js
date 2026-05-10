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
if(isCurrentDropTarget){
console.log ("id:", itemId)
console.log ("AFTER:", elementsAfterSelectedIds)
console.log ("BEFORE", elementsBeforeSelectedIds)
}


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

export const createDragPreview = (item, selectedIds) => {
  const el = document.createElement("div");

  el.style.position = "absolute";
  el.style.top = "-1000px";
  el.style.left = "-1000px";
  el.style.padding = "10px 16px";
  el.style.background = "#1e1e1e";
  el.style.color = "white";
  el.style.borderRadius = "6px";
  el.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
  el.style.fontSize = "13px";
  el.style.pointerEvents = "none";

  const isMultiple = selectedIds.length > 1;

  el.innerHTML = isMultiple
    ? `📦 ${selectedIds.length} елементи`
    : `📄 ${item.mailName}`;

  document.body.appendChild(el);

  return el;
};

export const cleanupDragPreview = (el) => {
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
};