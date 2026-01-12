export const resolveVisitedPageUpdate = ({
  pageName,
  pageFromURL,
  isApplied,
  foundResultsLength,
  dispatch,
  actions
}) => {
  const {
    setLastVisitedPage,
    setFilterPage,
    rememberCurrentPage
  } = actions;

  if (isApplied && foundResultsLength > 0) {
    dispatch(setLastVisitedPage(pageName, pageFromURL));
    if (pageFromURL !== "foundResults") {
      dispatch(setFilterPage(pageName, pageFromURL));
    }
    return;
  }

  if (!isApplied) {
    dispatch(rememberCurrentPage(pageName, pageFromURL));
    return;
  }

  if (isApplied && foundResultsLength === 0) {
    dispatch(setFilterPage(pageName, pageFromURL));
    dispatch(setLastVisitedPage(pageName, pageFromURL));
  }
};
