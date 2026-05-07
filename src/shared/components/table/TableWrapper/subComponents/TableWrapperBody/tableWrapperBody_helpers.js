export const getEditStyle = ({ editMode, isDragging, isSelected }) => ({
  cursor: editMode ? "grab" : "default",
  opacity: editMode && isDragging ? 0.5 : 1,
  transform: isDragging ? "scale(1.03)" : "scale(1)",
background:
  (editMode && isSelected) || isDragging
    ? "#d0ebff"
    : "",
  boxShadow: isDragging
    ? "0 6px 18px rgba(0,0,0,0.2)"
    : "none",
  transition: "all 0.2s ease",
  userSelect: editMode ? "none" : "auto",
});

const resetRowTransforms = (tr) => {
  if (!tr) return;

  const tds = tr.querySelectorAll("td");

  tds.forEach((td) => {
    const content = td.firstElementChild || td;

    content.style.transform = "translateY(0)";
    content.style.transition = "transform 0.15s ease";

    td.style.borderTop = "none";
    td.style.borderBottom = "none";

    // якщо юзаєш box-shadow варіант
    td.style.boxShadow = "none";
  });
};

export const getDragProps = ({
  editMode,
  itemId,
  index,
  page,
  startDrag,
  handleDrop,
  toggleSelect,
  elementsBeforeSelectedIds,
  elementsAfterSelectedIds,
  stopDrag,
  isOnFoundResultsPage
  
}) => {
  if (!editMode) return {};

  return {
    draggable: true,

    onDragStart: () => {
      startDrag(itemId);
    },

onDragOver: (e) => {
  if(isOnFoundResultsPage) return
  e.preventDefault();

  const tr = e.currentTarget;
  if (!tr) return;

  const tds = tr.querySelectorAll("td");

  const isAfter = elementsAfterSelectedIds?.includes(itemId);
  const isBefore = elementsBeforeSelectedIds?.includes(itemId);

  tds.forEach((td) => {
    const content = td.firstElementChild || td;

    content.style.transition = "transform 0.15s ease";

    // reset перед новим станом
    td.style.borderTop = "none";
    td.style.borderBottom = "none";

    if (isAfter) {
      content.style.transform = "translateY(4px)";
      td.style.borderTop = "2px dashed #4dabf7"; // 👈 лінія зверху
    } else if (isBefore) {
      content.style.transform = "translateY(-4px)";
      td.style.borderBottom = "2px dashed #4dabf7"; // 👈 лінія знизу
    } else {
      content.style.transform = "translateY(0)";
    }
  });
},

 onDragLeave: (e) => {
  const tr = e.currentTarget;
  const related = e.relatedTarget;

  // 🔥 якщо ми просто перейшли всередині того ж tr — ігноруємо
  if (tr && related && tr.contains(related)) {
    return;
  }

  resetRowTransforms(tr);
},

    onDrop: (e) => {
      resetRowTransforms(e.currentTarget);
      handleDrop(index, page);
    },

    onDragEnd: (e) => {
      resetRowTransforms(e.currentTarget);
      stopDrag?.();
    },

   onClick: (e) => {
  toggleSelect(itemId, e);
},
  };
};

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


