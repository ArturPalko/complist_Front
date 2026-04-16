import { buildBookmarks } from "../builders/buildBookmarks";

export const setBookmarkLogic = (menuState, deptName, sections = []) => {
  const bookmarks = menuState.bookmarks;

  const selectedSubDepts = { ...bookmarks.selectedSubDepts };
  const selectedSubs = selectedSubDepts[deptName] || [];

  if (sections.length === 0) {
    if (selectedSubDepts[deptName]) {
      delete selectedSubDepts[deptName];
    } else {
      selectedSubDepts[deptName] = true;
    }
  } else {
    if (selectedSubs.length === sections.length) {
      delete selectedSubDepts[deptName];
    } else {
      selectedSubDepts[deptName] =
        sections.map(s => s.sectionName);
    }
  }

  return buildBookmarks({
    bookmarks,
    deptName,
    selectedSubDepts
  });
};