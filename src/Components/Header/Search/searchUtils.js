import { excludedKeys } from "../../../configs/search/excludedKeys";
import { Pages } from "../../../configs/app/constants";



export const clearDictionarySearchResults = (
  currentMode,
  previousModeRef,
  clearSearchForm
) => {
  const previousMode = previousModeRef.current;

  if (
    currentMode &&
    previousMode !== currentMode
  ) {
    clearSearchForm(Pages.DICTIONARIES);
  }

  previousModeRef.current = currentMode;
};







export const runSearch = ({ searchValue, searchTarget }) => {
  const query = searchValue.trim().toLowerCase();
  if (query.length < 3) return [];

  const foundResults = [];

  const getIdByRowType = (row) => {
    const idMap = {
      section: row.sectionId,
      department: row.departmentId,
      user: row.userId,
      position: row.id,
      userType: row.id
    };

    return idMap[row.type];
  };

  const normalize = (val) => {
    if (val === null || val === undefined) return "";
    return String(val).toLowerCase().trim();
  };

  for (const page of searchTarget) {
    const rows = page?.rows;
    if (!rows) continue;

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      if (!row) continue;

      const index = rowIndex + 1;

      // 1. SEARCH IN ROW
      const matchedKey = Object.entries(row).find(
        ([key, value]) =>
          !excludedKeys.includes(key) &&
          typeof value === "string" &&
          normalize(value).includes(query)
      );

      if (matchedKey) {
        const [key, value] = matchedKey;

        foundResults.push({
          id: getIdByRowType(row),
          elementType: row.type,
          dataKey: key,
          dataValue: value,
          currentPage: page.pageIndex,
          index
        });

        continue;
      }

      // 2. DEPSEC
      const depSec = row.depSec;

      if (depSec && typeof depSec === "object") {
        for (const [key, value] of Object.entries(depSec)) {
          if (excludedKeys.includes(key)) continue;

          if (normalize(value).includes(query)) {
            foundResults.push({
              elementType: row.type,
              dataKey: key,
              dataValue: value,
              currentPage: page.pageIndex,
              index
            });
          }
        }
      }

      // 3. PHONES
      if (Array.isArray(row.phones)) {
        for (const phone of row.phones) {
          const phoneName = phone?.phoneName;

          if (normalize(phoneName).includes(query)) {
            foundResults.push({
              elementType: row.type,
              dataKey: "phoneName",
              dataValue: phoneName,
              currentPage: page.pageIndex,
              index
            });
          }
        }
      }

      // 4. USERS
      if (Array.isArray(row.users)) {
        for (const user of row.users) {
          const userName = user?.name;

          if (normalize(userName).includes(query)) {
            foundResults.push({
              elementType: row.type,
              dataKey: "name",
              dataValue: userName,
              currentPage: page.pageIndex,
              index
            });
          }
        }
      }
    }
  }

  return foundResults;
};
