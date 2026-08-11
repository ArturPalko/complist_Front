import { pageConfigs } from "../../../configs/app/pageConfig";
import { Pages } from "../../../configs/app/constants";

export const handleLastVisitedPage = ({
  pageName,
  currentMode,
  pageFromURL,
  isFilterApplied,
  searchValue,
  setLastVisitedPage,
  setFilterPage,
  rememberCurrentPage,

}) => {
    

  if (!pageName || !pageFromURL) return;
  
  const dictionaryModes = ["positions", "userTypes", "departments"];
  const phoneModes = ["landline", "internal", "cisco"];

  const pageKey =
    dictionaryModes.includes(currentMode) ||
    phoneModes.includes(currentMode)
      ? currentMode
      : pageName;

  const isApplied = isFilterApplied(pageKey);
  const results = searchValue?.foundResults || [];

if (isApplied && results.length > 0) {
  setLastVisitedPage(pageName, pageFromURL, currentMode);

  if (pageFromURL !== "foundResults") {
    setFilterPage(pageName, pageFromURL, currentMode);
  }

} else if (!isApplied) {
  rememberCurrentPage(pageName, pageFromURL, currentMode);

} else if (isApplied && results.length === 0) {
  setFilterPage(pageName, pageFromURL, currentMode);
  setLastVisitedPage(pageName, pageFromURL, currentMode);
}
};

export const handleSearchResults = ({ isSearchValueFound, searchValue, setShowFoundResultsPage, setIndexes }) => {
  if (isSearchValueFound) {
    setShowFoundResultsPage(true);

    const results = searchValue?.foundResults || [];
    const pages = results.map((r) => r.currentPage).filter(Boolean);

    setIndexes(pages);
  } else {
    setShowFoundResultsPage(false);
    setIndexes([]);
  }
};


export const getPageInfoFromPath = (pathParts) => {
  let pageName = "";
  let basePath = "";
  let pageFromURL = "1";

  if (!pathParts || !pathParts.length) return { pageName, basePath, pageFromURL };
    
  if (pathParts[0] === Pages.PHONES) {
    pageName = Pages.PHONES;
    const config = pageConfigs[pageName];
    basePath = config.basePath;
    pageFromURL = pathParts[config.pageFromURLIndex];
  }
  else if (pathParts[0] === "mails") {
    const mailType = pathParts[1];
    if (mailType === Pages.LOTUS || mailType === Pages.GOV_UA) {
      pageName = mailType;
      const config = pageConfigs[pageName];
      basePath = config.basePath;
      pageFromURL = pathParts[config.pageFromURLIndex];
    }
  }
 else if (pathParts[0] === Pages.DICTIONARIES) {
    pageName = Pages.DICTIONARIES;

    const config = pageConfigs[pageName];

    const mode = pathParts[1];

    basePath = `/dictionary/${mode}/`;

    pageFromURL = pathParts[config.pageFromURLIndex];
}

  return { pageName, basePath, pageFromURL };
};

export const getPagesCount = ({ countFiltred, pagesCount, activeMenu, isFilterApplied, pageName }) => {
  let count = countFiltred(activeMenu);
    
  if ((!count || count.length === 0) && !isFilterApplied(pageName)) {
    count = pagesCount;
  }

  return count;
};


