import { excludedKeys } from "../../../configs/search/excludedKeys"

export const runSearch = ({
  searchValue,
  searchTarget,
}) => {
  const searchValueTrimmed = searchValue.trim();

  if (searchValueTrimmed.length < 3) {
    return [];
  }

  const foundResults = [];

  searchTarget.forEach(page => {
    if (!page?.rows) return;

    page.rows.forEach((row, rowIndex) => {
      if (!row) return;

      const index = rowIndex + 1;
      let foundInRow = false;

      for (const [key, value] of Object.entries(row)) {
        if (
          !excludedKeys.includes(key) &&
          typeof value === "string" &&
          value.toLowerCase().includes(searchValueTrimmed.toLowerCase())
        ) {
          foundResults.push({
            elementType: row.type,
            dataKey: key,
            dataValue: value,
            currentPage: page.pageIndex,
            index,
          });

          foundInRow = true;
          break;
        }
      }

      if (!foundInRow && Array.isArray(row.phones)) {
        row.phones.forEach(phone => {
          if (
            phone?.phoneName
              ?.toLowerCase()
              .includes(searchValueTrimmed.toLowerCase())
          ) {
            foundResults.push({
              elementType: row.type,
              dataKey: "phoneName",
              dataValue: phone.phoneName,
              currentPage: page.pageIndex,
              index,
            });
          }
        });
      }
    });
  });

  return foundResults;
};
