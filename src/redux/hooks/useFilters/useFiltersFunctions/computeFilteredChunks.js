import { passesFiltersForRow } from "./passesFiltersForRow";
import { rowsPerPage as defaultChunkSize } from "../../../../configs/app/constants";

export const computeFilteredChunks = ({
  state = {},
  subConditions = {},
  activeMenu,
  dataForMenu = [],
  conditions,
  selectedSubDepts = {},
  bookmarkConditions = {}, // приймаємо нову структуру
  chunkSize = defaultChunkSize,
  departments
}) => {
  
  const activeFilters = Object.entries(state)
    .filter(([key, v]) => v && conditions[key])
    .map(([key]) => key);

  const allFilteredIndexes = [];
  const effectiveSubConditions = activeMenu === "phones" ? subConditions : {};

  // Забезпечуємо дефолтну структуру для нових чекбоксів
  const hideUsers = bookmarkConditions.hideUsers || {};
  const hideSections = bookmarkConditions.hideSections || {};

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
          activeMenu,
          departments
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