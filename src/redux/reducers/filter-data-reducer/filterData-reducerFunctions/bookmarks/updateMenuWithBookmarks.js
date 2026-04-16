import { isAnyFilterApplied } from "./isAnyFIilterApplied";

export const updateMenuWithBookmarks = (filtersState, bookmarks) => {
  const nextMenu = {
    ...filtersState,
    bookmarks
  };

  return {
    ...nextMenu,
    isFilterApplied: isAnyFilterApplied(nextMenu)
  };
};