
 export const hasAnyFilters = (filtersObj = {}, subconditionsObj = {}) => {
    const hasMain = Object.entries(filtersObj)
      .filter(([key]) => key !== "subFilters")
      .some(([, value]) => value === true);

    const hasSub = Object.values(subconditionsObj)
      .some(category => category && Object.values(category).some(Boolean));

     return hasMain || hasSub;
   };

export const generatePhonesSubConditions = (subFiltersFromRedux, activeMenu) => {
  if (activeMenu !== "phones") return {};

  const result = {};

  Object.entries(subFiltersFromRedux || {}).forEach(([category, keysObj]) => {
    if (!keysObj) return;

    const activeKeys = Object.entries(keysObj)
      .filter(([, isActive]) => isActive);

    if (!activeKeys.length) return;

    result[category] = {};

    activeKeys.forEach(([key]) => {
      result[category][key] = (row) => {

        if (category === "contactType")
          return row.userType === key;

        if (category === "userPosition")
          return row.userPosition === key;

        return false;

      };
    });

  });

  return result;
};

export const getAlternativeKeysHelper = (key, filterGroups) => {
  if (!key || !filterGroups) return [];

  const direct = filterGroups[key] || [];

  const reverse = Object.keys(filterGroups).filter(groupKey =>
    filterGroups[groupKey]?.includes(key)
  );

  return [...direct, ...reverse];
};


export const syncFilteredIndexesToRedux = ({ activeMenu, filteredChunks, dispatch,addIndexesOfFiltredResults }) => {
  if (!activeMenu) return;
  dispatch(addIndexesOfFiltredResults(activeMenu, filteredChunks));
};