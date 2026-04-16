import { buildBulkBookmarks } from "../builders/buildBulkBookmarks";

export const toggleAllDepartmentsLogic = (menuState, departments) => {
  const bookmarks = menuState.bookmarks;

  const allSelected =
    Object.keys(bookmarks.selectedSubDepts).length === departments.length;

  // ===== CLEAR ALL =====
  if (allSelected) {
    return {
      ...bookmarks,
      selectedSubDepts: {},
      selectedOrder: [],
      hideUsersWithoutSections: {},
      hideSections: {}
    };
  }

  // ===== SELECT ALL =====
  const selectedSubDepts = {};

  departments.forEach(dept => {
    const deptName = dept.departmentName || dept.name;
    const sections = dept.sections || [];

    selectedSubDepts[deptName] =
      sections.length === 0
        ? true
        : sections.map(s => s.sectionName);
  });

  return buildBulkBookmarks({
    bookmarks,
    selectedSubDepts
  });
};