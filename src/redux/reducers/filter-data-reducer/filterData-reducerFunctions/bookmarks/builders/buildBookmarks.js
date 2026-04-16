import { resolveBookmarkState } from "../resolveBookmarkState";

export const buildBookmarks = ({
  bookmarks,
  deptName,
  selectedSubDepts
}) => {
  const {
    selectedOrder,
    hideUsersWithoutSections,
    hideSections
  } = resolveBookmarkState({
    bookmarks,
    deptName,
    nextSelectedSubDepts: selectedSubDepts
  });

  return {
    ...bookmarks,
    selectedSubDepts,
    selectedOrder,
    hideUsersWithoutSections,
    hideSections
  };
};