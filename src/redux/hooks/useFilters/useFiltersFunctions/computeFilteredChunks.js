import { passesFiltersForRow } from "./passesFiltersForRow";
import { rowsPerPage as defaultChunkSize } from "../../../../configs/app/constants";

/**
 * selectedSubDepts: {
 *   "Департамент 1": true,             // всі секції
 *   "Департамент 2": ["Секція 1"]     // тільки вибрані секції
 * }
 */
export const computeFilteredChunks = ({
  state = {},
  subConditions = {},
  activeMenu,
  dataForMenu = [],
  conditions,
  selectedSubDepts = {},
  chunkSize = defaultChunkSize
}) => {

  const activeFilters = Object.entries(state)
    .filter(([key, v]) => v && conditions[key])
    .map(([key]) => key);

  const allFilteredIndexes = [];
  const effectiveSubConditions = activeMenu === "phones" ? subConditions : {};

  // Перетворюємо selectedSubDepts у формат bookmarkConditions
  const bookmarkConditions = {
    departments: Object.entries(selectedSubDepts)
      .filter(([_, val]) => val === true)
      .map(([dept]) => dept),
    sections: Object.entries(selectedSubDepts)
      .filter(([_, val]) => Array.isArray(val))
      .reduce((acc, [dept, sections]) => {
        acc[dept] = sections;
        return acc;
      }, {})
  };
debugger;
  dataForMenu.forEach((element, pageIndex) => {
    const rows = element?.rows || [];
    rows.forEach((row, rowIndex) => {
      if (
        passesFiltersForRow(
          row,
          activeFilters,
          effectiveSubConditions,
          bookmarkConditions
        )
      ) {
        allFilteredIndexes.push({
          page: pageIndex + 1,
          index: rowIndex,
          type: row.type
        });
      }
    });
  });

  const chunks = [];
  for (let i = 0; i < allFilteredIndexes.length; i += chunkSize) {
    chunks.push({
      pageIndex: chunks.length + 1,
      rows: allFilteredIndexes.slice(i, i + chunkSize)
    });
  }

  return chunks;
};