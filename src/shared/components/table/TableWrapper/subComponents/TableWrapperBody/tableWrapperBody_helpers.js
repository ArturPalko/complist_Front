export const getEditStyle = ({ editMode, isDragging, isSelected }) => ({
  cursor: editMode ? "grab" : "default",
  opacity: editMode && isDragging ? 0.5 : 1,
  background: editMode && isSelected ? "#d0ebff" : "",
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