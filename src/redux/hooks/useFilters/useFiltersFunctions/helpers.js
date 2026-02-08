// Перевіряє, чи є активні main + sub фільтри
export const hasActiveFilters = (usedFilters, subConditions) => {
  const mainApplied = Object.entries(usedFilters)
    .filter(([key]) => key !== "subFilters")
    .some(([, value]) => value === true);

  const subApplied = Object.values(subConditions || {}).some(category =>
    Object.values(category || {}).some(v => v === true)
  );

  return mainApplied || subApplied;
};

// Генерує функції сабфільтрів для phones
export const generateSubConditionFunctions = (subFiltersFromRedux) => {
  const result = {};
  Object.entries(subFiltersFromRedux).forEach(([category, keysObj]) => {
    if (!keysObj) return;
    const activeKeys = Object.entries(keysObj).filter(([, v]) => v);
    if (!activeKeys.length) return;

    result[category] = {};
    activeKeys.forEach(([key]) => {
      result[category][key] = (row) => {
        if (category === "contactType") return row.userType === key;
        if (category === "userPosition") return row.userPosition === key;
        return false;
      };
    });
  });
  return result; // <-- повертаємо result тут, без зайвої дужки
};

// Порожні сабфільтри для phones
export const emptySubFilters = { contactType: {}, userPosition: {} };
