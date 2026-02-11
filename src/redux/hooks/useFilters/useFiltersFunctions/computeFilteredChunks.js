import { passesFiltersForRow } from "./passesFiltersForRow";
import { rowsPerPage as defaultChunkSize } from "../../../../configs/app/constants";

export const computeFilteredChunks = ({
  state = {},
  subConditions = {},
  activeMenu,
  dataForMenu = [],
  conditions,
  chunkSize = defaultChunkSize
}) => {
  // Визначаємо активні фільтри
  const activeFilters = Object.entries(state)
    .filter(([key, v]) => v && conditions[key])
    .map(([key]) => key);

  const allFilteredIndexes = [];

  // Для menus крім phones саб-фільтри завжди порожні
  const effectiveSubConditions = activeMenu === "phones" ? subConditions : {};

  dataForMenu.forEach((element, pageIndex) => {
    const rows = element?.rows || [];
    rows.forEach((row, rowIndex) => {
      if (passesFiltersForRow(row, activeFilters, effectiveSubConditions)) {
        allFilteredIndexes.push({
          page: pageIndex + 1,
          index: rowIndex,
          type: row.type
        });
      }
    });
  });

  // Розбиваємо на чанки
  const chunks = [];
  for (let i = 0; i < allFilteredIndexes.length; i += chunkSize) {
    chunks.push({
      pageIndex: chunks.length + 1,
      rows: allFilteredIndexes.slice(i, i + chunkSize)
    });
  }

  return chunks;
};
