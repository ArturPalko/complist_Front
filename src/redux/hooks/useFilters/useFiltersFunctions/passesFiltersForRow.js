import { filterGroups, conditions } from "./filtersLogics";

export const passesFiltersForRow = (
  row,
  activeFilters = [],
  subConditions = {},
  bookmarkConditions = null,
  activeMenu,
  departmentsFromRedux = []
) => {
  const {
    departments = [],
    sections = {},
    hideUsers = {},
    hideSections = {},
  } = bookmarkConditions || {};

  const hasBookmarks =
    departments.length > 0 || Object.keys(sections).length > 0;

  // ------------------ HELPERS ------------------
  const getDeptName = (el) =>
    activeMenu === "phones" ? el.departmentName : el.depSec?.department || "";

  const getSectionName = (el) =>
    activeMenu === "phones" ? el.sectionName : el.depSec?.section || "";

  const checkRowOrUser = (el) => {
    const deptName = getDeptName(el);
    const sectionName = getSectionName(el);

    const isUserWithoutSection = el.type === "user" && (!sectionName || sectionName === "");

    // =====================================================
    // 🔥 PHONES — ЛОГІКА BOOKMARKS
    // =====================================================
    if (activeMenu === "phones") {
      if (hideUsers[deptName] && isUserWithoutSection) return false;
      if (hideSections[deptName] && sectionName) return false;

      if (hasBookmarks) {
        const selectedSections = sections[deptName] || [];
        let bookmarkPass = false;

        if (row.type === "department") {
          if (departments.includes(deptName)) bookmarkPass = true;
        } else {
          if (selectedSections.length === 0 && departments.includes(deptName)) {
            bookmarkPass = true;
          } else if (sectionName) {
            bookmarkPass = selectedSections.includes(sectionName);
          }
          // user без секції залишає bookmarkPass = false
        }

        if (!bookmarkPass) {
          // спец правило для user без секції — застосовуємо фільтри
          if (el.type === "user" && isUserWithoutSection && selectedSections.length > 0) {
            const filtersPass =
              activeFilters.length === 0
                ? true
                : activeFilters.every((key) => {
                    const parentKey = Object.keys(filterGroups).find(
                      (grp) => filterGroups[grp].includes(key)
                    );

                    if (!parentKey) {
                      return typeof conditions[key] === "function" && conditions[key](el);
                    }

                    const alternatives = filterGroups[parentKey];
                    const activeAlternatives = alternatives.filter((a) =>
                      activeFilters.includes(a)
                    );

                    return activeAlternatives.some(
                      (a) => typeof conditions[a] === "function" && conditions[a](el)
                    );
                  });

            const subConditionsPass =
              Object.values(subConditions || {}).some((groupObj) =>
                Object.keys(groupObj || {}).length > 0
              )
                ? Object.values(subConditions || {}).some((groupObj) =>
                    Object.values(groupObj || {}).some((condFn) => condFn(el))
                  )
                : true;

            return filtersPass && subConditionsPass;
          }

          return false;
        }
      }
    }

    // =====================================================
    // 🔥 НЕ PHONES — НОВА ЛОГІКА
    // =====================================================
    else {
      if (hasBookmarks) {
        let bookmarkPass = false;
        if (departments.includes(deptName)) {
          const deptObj = departmentsFromRedux.find((d) => d.departmentName === deptName);
          const selectedSections = Array.isArray(sections[deptName]) ? sections[deptName] : [];
          const totalSections = Array.isArray(deptObj?.sections) ? deptObj.sections.length : 0;
          const isAllSectionsSelected = selectedSections.length === totalSections;

          if (isAllSectionsSelected) bookmarkPass = true;
          else bookmarkPass = selectedSections.includes(sectionName);
        }

        if (!bookmarkPass) return false;
      }
    }

    // =====================================================
    // 🔥 FILTERS (спільні)
    // =====================================================
    const filtersPass =
      activeFilters.length === 0
        ? true
        : activeFilters.every((key) => {
            const parentKey = Object.keys(filterGroups).find(
              (grp) => filterGroups[grp].includes(key)
            );

            if (!parentKey) {
              return typeof conditions[key] === "function" && conditions[key](el);
            }

            const alternatives = filterGroups[parentKey];
            const activeAlternatives = alternatives.filter((a) =>
              activeFilters.includes(a)
            );

            return activeAlternatives.some(
              (a) => typeof conditions[a] === "function" && conditions[a](el)
            );
          });

    // =====================================================
    // 🔥 SUB FILTERS
    // =====================================================
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

  // =====================================================
  // 🔥 ROW TYPES
  // =====================================================
  if (row?.type === "department") {
    const usersPass = row.users?.some(checkRowOrUser) ?? false;
    const sectionsPass =
      row.sections?.some((section) => section.users?.some(checkRowOrUser) ?? false) ?? false;
    return usersPass || sectionsPass;
  }

  if (row?.type === "section") {
    return row.users?.some(checkRowOrUser) ?? false;
  }

  return checkRowOrUser(row);
};