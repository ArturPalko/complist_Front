export const getSelectMode = (e) => {
  debugger
  if (e?.altKey) return "RANGE";
  if (e?.ctrlKey) return "TOGGLE";
  return "RESET";
};

export const toggleInArray = (list, id) => {
  return list.includes(id)
    ? list.filter(x => x !== id)
    : [...list, id];
};

export const getRangeSelection = (rangeStartId, id, selectRange) => {
  if (!rangeStartId) {
    return { type: "SET_START", id };
  }

  return {
    type: "APPLY_RANGE",
    from: rangeStartId,
    to: id,
  };
};