export const isAnyFilterApplied = (phonesState) => {
  const { usedFilters, bookmarks } = phonesState;

  const main = Object.values(usedFilters)
    .filter(v => typeof v === "boolean")
    .some(Boolean);

  const sub = Object.values(usedFilters.subFilters || {})
    .some(category => Object.values(category || {}).some(Boolean));

  const bookmarksApplied =
    Object.keys(bookmarks.selectedSubDepts || {}).length > 0;

  return main || sub || bookmarksApplied;
};