import { isAnyFilterApplied } from "../bookmarks/isAnyFIilterApplied";

export const updateFilters = (menu, config) => {
  const {
    type,
    filter,
    subFiltersUpdate,
  } = config;

  let newUsedFilters = menu.usedFilters;

  // =====================================================
  // 1. SIMPLE TOGGLE (usedFilters boolean flags)
  // =====================================================
  if (type === "mainFilters") {
    const { subFilters, ...rest } = menu.usedFilters;

    newUsedFilters = {
      ...rest,
      [filter]: !rest[filter],
      subFilters
    };
  }

  // =====================================================
  // 2. SUBFILTERS UPDATE (nested structure)
  // =====================================================
  if (type === "subFilters") {
    const { variety, values, checked } = subFiltersUpdate;

    const currentVariety =
      menu.usedFilters.subFilters?.[variety] || {};

    const newVariety = { ...currentVariety };

    values.forEach(value => {
      newVariety[value] =
        checked === null ? !currentVariety[value] : checked;
    });

    newUsedFilters = {
      ...menu.usedFilters,
      subFilters: {
        ...menu.usedFilters.subFilters,
        [variety]: newVariety
      }
    };
  }

  // =====================================================
  // FINAL STEP (shared logic)
  // =====================================================
  const isFilterApplied = isAnyFilterApplied({
    ...menu,
    usedFilters: newUsedFilters
  });

  return {
    ...menu,
    usedFilters: newUsedFilters,
    isFilterApplied
  };
};