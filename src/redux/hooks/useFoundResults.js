import { useFilteredPageData } from "../../redux/hooks/hooks";
import { rowsPerPage } from "../../configs/app/constants";

export const useFoundResults = (
  data,
  foundSearchValues,
  activeMenu,
  isFilterApplied
) => {
  const { data: filteredPageData } = useFilteredPageData(data);
  const dataToSearch = isFilterApplied ? filteredPageData : data;

  const foundResultsForCurrentMenu =
    foundSearchValues[activeMenu]?.foundResults || [];

  const normalize = (val) => {
    if (val === null || val === undefined) return "";
    return String(val).toLowerCase().trim();
  };

  const presentRows = dataToSearch.flatMap((item) =>
    item.rows.filter((row) =>
      foundResultsForCurrentMenu.some((result) => {
        const samePage = item.pageIndex === result.currentPage;

        if (!samePage) return false;

        //  1. row fields
        const inRow = Object.values(row)
          .filter((v) => typeof v === "string")
          .some((v) => normalize(v) === normalize(result.dataValue));

        //  2. phones
        const inPhones = row.phones?.some(
          (phone) =>
            normalize(phone?.phoneName) === normalize(result.dataValue)
        );

        //  3. depSec (OBJECT)
        const inDepSec =
          row.depSec &&
          typeof row.depSec === "object" &&
          Object.values(row.depSec)
            .filter((v) => typeof v === "string")
            .some((v) => normalize(v) === normalize(result.dataValue));

        return inRow || inPhones || inDepSec;
      })
    )
  );

  const indexDataOfFoundResultsForFoundResultsPage =
    foundResultsForCurrentMenu.map((r) => ({
      currentPage: r.currentPage,
      index: r.index,
    }));


  const tooManyResults = presentRows.length > rowsPerPage;

  return {
    presentRows,
    indexDataOfFoundResultsForFoundResultsPage,
    tooManyResults,
  };
};