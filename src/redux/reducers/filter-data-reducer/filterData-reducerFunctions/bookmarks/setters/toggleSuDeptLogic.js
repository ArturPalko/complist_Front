import { buildBookmarks } from "../builders/buildBookmarks";

export const toggleSubDeptLogic = (menuState, deptName, sub) => {
  const bookmarks = menuState.bookmarks;

  const selectedSubDepts = { ...bookmarks.selectedSubDepts };

  const current = selectedSubDepts[deptName] || [];

  const newSubs = current.includes(sub)
    ? current.filter(s => s !== sub)
    : [...current, sub];

  if (newSubs.length === 0) {
    delete selectedSubDepts[deptName];
  } else {
    selectedSubDepts[deptName] = newSubs;
  }

  return buildBookmarks({
    bookmarks,
    deptName,
    selectedSubDepts
  });
};