import { excludedKeys } from "../../../configs/search/excludedKeys"

export const runSearch = ({ searchValue, searchTarget }) => {
  const trimmedLower = searchValue.trim().toLowerCase();
  if (trimmedLower.length < 3) return [];

  const foundResults = [];

  for (const page of searchTarget) {
    const rows = page?.rows;
    if (!rows) continue;

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      if (!row) continue;

      const index = rowIndex + 1;

      // Перевіряємо ключі рядка
      const matchedKey = Object.entries(row).find(
        ([key, value]) =>
          !excludedKeys.includes(key) &&
          typeof value === "string" &&
          value.toLowerCase().includes(trimmedLower)
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
        continue; // одразу йдемо до наступного рядка
      }

      // Перевіряємо телефони, якщо ключі не дали збігів
      if (Array.isArray(row.phones)) {
        for (const phone of row.phones) {
          const phoneName = phone?.phoneName;
          if (phoneName?.toLowerCase().includes(trimmedLower)) {
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
