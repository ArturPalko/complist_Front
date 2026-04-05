export const buildBookmarkConditions = (selectedSubDepts = {}, bookmarks = {}) => {
  const departments = [];
  const sections = {};
  const hideUsers = {};
  const hideSections = {};

  Object.entries(selectedSubDepts).forEach(([dept, value]) => {
    if (value === true) {
      departments.push(dept);
    }

    if (Array.isArray(value)) {
      departments.push(dept);
      sections[dept] = value;
    }

    hideUsers[dept] = bookmarks.hideUsersWithoutSections?.[dept] || false;
    hideSections[dept] = bookmarks.hideSections?.[dept] || false;
  });

  return { departments, sections, hideUsers, hideSections };
};