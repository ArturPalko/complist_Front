export const toggleBookmarkFlag = (menu, mapKey, deptName) => {
  const bookmarks = menu.bookmarks;
  const current = bookmarks[mapKey][deptName] || false;

  return {
    ...menu,
    bookmarks: {
      ...bookmarks,
      [mapKey]: {
        ...bookmarks[mapKey],
        [deptName]: !current
      }
    }
  };
};