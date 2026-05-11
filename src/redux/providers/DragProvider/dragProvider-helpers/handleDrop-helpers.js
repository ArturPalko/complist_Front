export const getGlobalIndex = (page, toIndex, rowsPerPage) => {
  return (page - 1) * rowsPerPage + toIndex;
};


export const getDragBounds = (dragIds, fullData) => {
  const draggedIndexes = dragIds
    .map(id => fullData.findIndex(i => i.id === id))
    .filter(i => i !== -1);

  if (!draggedIndexes.length) return null;

  return {
    min: Math.min(...draggedIndexes),
    max: Math.max(...draggedIndexes),
  };
};

export const isDropInsideSelf = (globalToIndex, bounds) => {
  if (!bounds) return false;

  return (
    globalToIndex >= bounds.min &&
    globalToIndex <= bounds.max
  );
};