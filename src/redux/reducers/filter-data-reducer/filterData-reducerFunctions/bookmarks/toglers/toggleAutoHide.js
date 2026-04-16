export const buildHideMap = (selected) =>
  Object.fromEntries(
    Object.entries(selected)
      .filter(([_, value]) => Array.isArray(value))
      .map(([key]) => [key, true])
  );


export const toggleAutoHide = (menu, flagKey, mapKey) => {
  const bookmarks = menu.bookmarks;
  const isOn = !bookmarks[flagKey];
  return {
    ...menu,
    bookmarks: {
      ...bookmarks,
      [flagKey]: isOn,
      [mapKey]: isOn
        ? buildHideMap(bookmarks.selectedSubDepts)
        : {}
    }
  };
};