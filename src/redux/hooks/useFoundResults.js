import { useFilteredPageData } from "../../redux/hooks/hooks";
import { Pages,rowsPerPage } from "../../redux/selectors/constants.js"

export const useFoundResults = (data, foundSearchValues, activeMenu, isFilterApplied) => {
  const { data: filteredPageData } = useFilteredPageData(data);
  const dataToSearch = isFilterApplied ? filteredPageData : data;

  const foundResultsForCurrentMenu = foundSearchValues[activeMenu]?.foundResults || [];

  // Фільтруємо рядки по знайденим результатам
  const presentRows = dataToSearch.flatMap(item =>
    item.rows.filter(row =>
      foundResultsForCurrentMenu.some(result =>
        item.pageIndex === result.currentPage &&
        (Object.values(row).includes(result.dataValue) ||
          (row.phones && row.phones.some(phoneObj => phoneObj.phoneName === result.dataValue)))
      )
    )
  );

  // Формуємо індекси знайдених результатів для сторінки
  const indexDataOfFoundResultsForFoundResultsPage = foundResultsForCurrentMenu.map(r => ({
    currentPage: r.currentPage,
    index: r.index
  }));

  // Флаг "занадто багато результатів"
  const tooManyResults = presentRows.length > rowsPerPage;

  return { presentRows, indexDataOfFoundResultsForFoundResultsPage, tooManyResults };
};
