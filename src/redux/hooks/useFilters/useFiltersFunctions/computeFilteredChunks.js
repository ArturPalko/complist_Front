import { passesFiltersForRow } from "./passesFiltersForRow";
import { rowsPerPage as defaultChunkSize } from "../../../../configs/app/constants";

/**
 * selectedSubDepts: {
 *   "Департамент 1": true,             // всі секції
 *   "Департамент 2": ["Секція 1"]     // тільки вибрані секції
 * }
 *
 * bookmarkConditions: {
 *   departments: [...],
 *   sections: {...},
 *   hideUsers: {...},     // нове
 *   hideSections: {...}   // нове
 * }
 */
export const computeFilteredChunks = ({
  state = {},
  subConditions = {},
  activeMenu,
  dataForMenu = [],
  conditions,
  selectedSubDepts = {},
  bookmarkConditions = {}, // приймаємо нову структуру
  chunkSize = defaultChunkSize
}) => {
  debugger
  const activeFilters = Object.entries(state)
    .filter(([key, v]) => v && conditions[key])
    .map(([key]) => key);

  const allFilteredIndexes = [];
  const effectiveSubConditions = activeMenu === "phones" ? subConditions : {};

  // Забезпечуємо дефолтну структуру для нових чекбоксів
  const hideUsers = bookmarkConditions.hideUsers || {};
  const hideSections = bookmarkConditions.hideSections || {};
// debugger;
  dataForMenu.forEach((element, pageIndex) => {
    
    const rows = element?.rows || [];
    rows.forEach((row, rowIndex) => {
      let deptName="";
      // Перевіряємо, чи департамент цього рядка вибраний
      if(activeMenu=="phones"){
          deptName = row.departmentName;
      }
      else{
          deptName = row.depSec.department;
      }
//  debugger;
      if (hideUsers[deptName] && !row.sectionName && row.type !="department") {
        // Приховуємо користувачів без секцій
        return;
      }

      if (hideSections[deptName] && row.sectionName) {
        // Приховуємо усі секції
        return;
      }

      if (
        passesFiltersForRow(
          row,
          activeFilters,
          effectiveSubConditions,
          bookmarkConditions,
          activeMenu
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