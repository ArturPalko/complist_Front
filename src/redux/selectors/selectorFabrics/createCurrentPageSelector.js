
export const createCurrentPageSelector = ({isFilterApplied, pageState, foundResults }) => {

  if (pageState.lastVisitedPage === "foundResults" && foundResults.length > 0) {
    return isFilterApplied ? pageState.filterPage : pageState.digitPage;
  }

if (isFilterApplied && !isNaN(Number(pageState.lastVisitedPage))) {
    return pageState.lastVisitedPage;
  }

  return pageState.digitPage;
};
