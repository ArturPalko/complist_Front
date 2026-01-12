import { useMemo } from "react";
import { parseLocation } from "./parseLocation";
import { getFoundResults } from "./getFoundResults";
import { getCountAndIsApplied } from "./getCountAndIsApplied";

export const usePageContext = ({
  pathname,
  foundPhones,
  foundLotus,
  foundGovUa,
  countFiltred,
  pagesCount,
  isFilterApplied
}) => {
  // --- URL
  const { pageName, basePath, pageFromURL } = useMemo(
    () => parseLocation(pathname),
    [pathname]
  );

  const isFoundResultsPage = pageFromURL === "foundResults";

  // --- Found results
  const foundResults = useMemo(
    () => getFoundResults(pageName, foundPhones, foundLotus, foundGovUa),
    [pageName, foundPhones, foundLotus, foundGovUa]
  );

  // --- Pagination
  const { count, isApplied } = useMemo(
    () => getCountAndIsApplied(
      pageName,
      countFiltred,
      pagesCount,
      isFilterApplied
    ),
    [pageName, countFiltred, pagesCount, isFilterApplied]
  );

  return {
    pageName,
    basePath,
    pageFromURL,
    isFoundResultsPage,
    foundResults,
    count,
    isApplied
  };
};
