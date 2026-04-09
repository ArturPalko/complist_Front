import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  activeMenu as selectActiveMenu,
  getDepartmentsAndSections,
  currentPageByMenu,
  getDataForMenu,
  selectFiltersForMenu,
  selectPhonesSubcondions,
  selectBookmarks,
  isFilterAppliedSelector
} from "../../selectors/selector";

import {
  conditions,
} from "./useFiltersFunctions/filtersLogics";

import {
  hasAnyFilters,
  generatePhonesSubConditions
} from "./useFiltersFunctions/helpers";

import { computeFilteredChunks } from "./useFiltersFunctions/computeFilteredChunks";
import { buildBookmarkConditions } from "../useFilters/useFiltersFunctions/buildBookmarkConditions";

export const useFiltersData = () => {

  const activeMenu = useSelector(selectActiveMenu);
  const isFilterApplied = useSelector(isFilterAppliedSelector(activeMenu));    const currentPage = useSelector(state => currentPageByMenu(state, activeMenu));
  const dataForMenu = useSelector(state => getDataForMenu(state, activeMenu));
  const filtersFromRedux = useSelector(selectFiltersForMenu(activeMenu)) || {};
  const subFiltersFromRedux = useSelector(selectPhonesSubcondions) || { contactType: {}, userPosition: {} };
  const bookmarks = useSelector(state => selectBookmarks(state, activeMenu)) || {};
  const depSec = useSelector(state => getDepartmentsAndSections(state, activeMenu));
  const departments = depSec.departments || [];

  const selectedSubDepts = bookmarks.selectedSubDepts || {};

  const bookmarkConditions = useMemo(
    () => buildBookmarkConditions(selectedSubDepts, bookmarks),
    [selectedSubDepts, bookmarks]
  );

  const hasBookmarks =
    Object.keys(selectedSubDepts).length > 0 ||
    Object.values(bookmarks.hideUsersWithoutSections || {}).some(Boolean) ||
    Object.values(bookmarks.hideSections || {}).some(Boolean);

  const phonesSubConditions = useMemo(
    () => generatePhonesSubConditions(subFiltersFromRedux, activeMenu),
    [subFiltersFromRedux, activeMenu]
  );

  const hasFilters = useMemo(
    () => hasAnyFilters(filtersFromRedux, phonesSubConditions) || hasBookmarks,
    [filtersFromRedux, phonesSubConditions, hasBookmarks]
  );

  const filteredChunks = useMemo(() => {
    if (!hasFilters) return [];

    return computeFilteredChunks({
      state: filtersFromRedux,
      subConditions: phonesSubConditions,
      bookmarkConditions,
      activeMenu,
      dataForMenu,
      conditions,
      selectedSubDepts,
      departments
    });
  }, [
    hasFilters,
    filtersFromRedux,
    phonesSubConditions,
    bookmarkConditions,
    activeMenu,
    dataForMenu,
    selectedSubDepts,
    departments
  ]);
  

  return {
     activeMenu,
    currentPage,
    filteredChunks,
    currentFilters: filtersFromRedux,
    phonesSubConditions,
    hasFilters,
    isFilterApplied,
    depSec,
    bookmarks,
    dataForMenu
  };
};