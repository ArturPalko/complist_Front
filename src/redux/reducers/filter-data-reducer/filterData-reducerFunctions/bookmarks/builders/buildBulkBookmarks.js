import {resolveBulkBookmarkState} from "../resolveBulkBookmarkState"

export const buildBulkBookmarks = ({
  bookmarks,
  selectedSubDepts
}) => {
  const {
    selectedOrder,
    hideUsersWithoutSections,
    hideSections
  } = resolveBulkBookmarkState({
    bookmarks,
    selectedSubDepts
  });

  return {
    ...bookmarks,
    selectedSubDepts,
    selectedOrder,
    hideUsersWithoutSections,
    hideSections
  };
};