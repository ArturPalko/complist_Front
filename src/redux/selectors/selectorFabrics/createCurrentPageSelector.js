import { isFilterAppliedSelector } from "../selector";


export const createCurrentPageSelector = ({ key, foundSelector, hasFilter = false }) => (state) => {
  const pageState = state.currentPageNumber[key];
  const foundResults = foundSelector(state)?.foundResults ?? [];
  const isFilterApplied = hasFilter ? isFilterAppliedSelector(key)(state) : false;

  if (pageState.lastVisitedPage === "foundResults" && foundResults.length > 0) {
    return isFilterApplied ? pageState.filterPage : pageState.digitPage;
  }

  if (typeof pageState.lastVisitedPage === "number") {
    return pageState.lastVisitedPage;
  }

  return pageState.digitPage;
};
