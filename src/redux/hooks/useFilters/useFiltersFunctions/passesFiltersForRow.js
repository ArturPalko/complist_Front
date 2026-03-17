import { filterGroups, conditions } from "./filtersLogics";

export const passesFiltersForRow = (
  row,
  activeFilters = [],
  subConditions = {},
  bookmarkConditions = null
) => {
  const { departments = [], sections = {} } = bookmarkConditions || {};
  const hasBookmarks = departments.length > 0 || Object.keys(sections).length > 0;

  const checkRowOrUser = (el) => {

    // ⭐ 1. BOOKMARK FILTER (працює першим)
    if (hasBookmarks) {
      const bookmarkPass =
        departments.includes(el.departmentName) ||
        (sections[el.departmentName] || []).includes(el.sectionName);

      if (!bookmarkPass) {
        // 2️⃣ Додаткове правило для користувачів без секції
        if (el.type === "user" && sections[el.departmentName] && el.sectionName == null) {
          return true;
        }
        return false;
      }
    }

    // ⭐ 2. Старі FilterPanel filters
    const filtersPass = activeFilters.length === 0
      ? true
      : activeFilters.every((key) => {
          const parentKey = Object.keys(filterGroups).find(
            (grp) => filterGroups[grp].includes(key)
          );

          if (!parentKey) {
            return typeof conditions[key] === "function" && conditions[key](el);
          }

          const alternatives = filterGroups[parentKey];
          const activeAlternatives = alternatives.filter((a) => activeFilters.includes(a));

          return activeAlternatives.some((a) => typeof conditions[a] === "function" && conditions[a](el));
        });

    // ⭐ 3. Sub filters
    const subConditionsPass =
      Object.values(subConditions || {}).some((groupObj) =>
        Object.keys(groupObj || {}).length > 0
      )
        ? Object.values(subConditions || {}).some((groupObj) =>
            Object.values(groupObj || {}).some((condFn) => condFn(el))
          )
        : true;

    return filtersPass && subConditionsPass;
  };

  if (row?.type === "department") {
    const usersPass = row.users?.some(checkRowOrUser) || false;
    const sectionsPass =
      row.sections?.some((section) =>
        section.users?.length > 0 && section.users.some(checkRowOrUser)
      ) || false;

    return usersPass || sectionsPass;
  }

  if (row?.type === "section") {
    return row.users?.length > 0 && row.users.some(checkRowOrUser);
  }

  return checkRowOrUser(row);
};