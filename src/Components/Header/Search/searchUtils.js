import { excludedKeys } from "../../../configs/search/excludedKeys";

export const runSearch = ({ searchValue, searchTarget }) => {
  const query = searchValue.trim().toLowerCase();
  if (query.length < 3) return [];

  const foundResults = [];

  //  нормалізація будь-якого значення
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

      //  1. SEARCH IN ROW (верхній рівень)
      const matchedKey = Object.entries(row).find(
        ([key, value]) =>
          !excludedKeys.includes(key) &&
          typeof value === "string" &&
          normalize(value).includes(query)
      );

      if (matchedKey) {
        const [key, value] = matchedKey;

        foundResults.push({
          elementType: row.type,
          dataKey: key,
          dataValue: value,
          currentPage: page.pageIndex,
          index,
        });

        continue; 
      }

      //  2. DEPSEC (object)
      const depSec = row.depSec;
      if (depSec && typeof depSec === "object") {
        for (const [key, value] of Object.entries(depSec)) {
          if (excludedKeys.includes(key)) continue;

          if (normalize(value).includes(query)) {
            debugger
            foundResults.push({
              elementType: row.type,
              dataKey: key,
              dataValue: value,
              currentPage: page.pageIndex,
              index,
            });
                    console.log("Results:", foundResults)
          }
        }
      }

      //  3. PHONES
      if (Array.isArray(row.phones)) {
        for (const phone of row.phones) {
          const phoneName = phone?.phoneName;

          if (normalize(phoneName).includes(query)) {
            foundResults.push({
              elementType: row.type,
              dataKey: "phoneName",
              dataValue: phoneName,
              currentPage: page.pageIndex,
              index,
            });
          }
       
        }
      }
    }
  }

  return foundResults;
};
