import { passesFiltersForRow } from "./passesFiltersForRow";
import { rowsPerPage as chunkSize } from "../../selectors/selector";

export const computeFilteredChunks = ({
  state = {},
  subConditions = {},
  activeMenu,
  getGovUaMails = [],
  getLotusMails = [],
  getPhones = [],
  conditions
}) => {
  const activeFilters = Object.entries(state)
    .filter(([key, v]) => v && conditions[key])
    .map(([key]) => key);

  const dataFromStore =
    activeMenu?.toLowerCase() === "gov-ua" ? getGovUaMails
    : activeMenu?.toLowerCase() === "lotus" ? getLotusMails
    : getPhones;

  const allFilteredIndexes = [];

  dataFromStore.forEach((element, pageIndex) => {
    const rows = element?.rows || [];
    rows.forEach((row, rowIndex) => {
      if (passesFiltersForRow(row, activeFilters, subConditions)) {
        allFilteredIndexes.push({ page: pageIndex + 1, index: rowIndex, type: row.type });
      }
    });
  });

  const chunks = [];
  for (let i = 0; i < allFilteredIndexes.length; i += chunkSize) {
    chunks.push({ pageIndex: chunks.length + 1, rows: allFilteredIndexes.slice(i, i + chunkSize) });
  }debugger;
  return chunks;
};
