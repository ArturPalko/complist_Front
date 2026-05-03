export const getEditStyle = ({ editMode, isDragging, isSelected }) => ({
  cursor: editMode ? "grab" : "default",
  opacity: editMode && isDragging ? 0.5 : 1,
  transform: isDragging ? "scale(1.03)" : "scale(1)",
  background: editMode && isSelected ? "#d0ebff" : "",
   boxShadow: isDragging
                ? "0 6px 18px rgba(0,0,0,0.2)"
                : "none",
              transition: "all 0.2s ease",
  userSelect: editMode ? "none" : "auto",
});

export const getDragProps = ({
  editMode,
  itemId,
  index,
  page,
  startDrag,
  handleDrop,
  toggleSelect,
}) => {
  if (!editMode) return {};

  return {
    draggable: true,
    onDragStart: () => startDrag(itemId),
    onDragOver: (e) => e.preventDefault(),
    onDrop: () => handleDrop(index, page),
    onClick: (e) => {
      if (e.ctrlKey) {
        toggleSelect(itemId);
      }
    },
  };
};


// dragPreview.js
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