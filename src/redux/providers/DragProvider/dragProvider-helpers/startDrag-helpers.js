export const getDragGroup = (id, selectedIds) => {
  return selectedIds.includes(id) ? selectedIds : [id];
};

export const getIndexes = (dragGroup, fullData) => {
  return dragGroup
    .map(id => fullData.findIndex(i => i.id === id))
    .filter(i => i !== -1);
};

export const getAnchorIndex = (indexes) => {
  if (!indexes.length) return -1;
  return Math.min(...indexes);
};

export const splitBeforeAfter = (fullData, anchorIndex) => {
  return {
    before: fullData.slice(0, anchorIndex).map(i => i.id),
    after: fullData.slice(anchorIndex + 1).map(i => i.id),
  };
};