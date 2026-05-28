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
  const ids = fullData.map(i => i.id);

  // 🔥 SPECIAL CASE: 2 items (inverted logic)
  if (ids.length === 2) {
    return {
      before: anchorIndex === 0 ? [ids[1]] : [],
      after: anchorIndex === 1 ? [ids[0]] : [],
    };
  }

  // ✅ DEFAULT LOGIC (unchanged)
  return {
    before: fullData.slice(0, anchorIndex).map(i => i.id),
    after: fullData.slice(anchorIndex + 1).map(i => i.id),
  };
};