export const countDictionaryRows = (dictionaryData) =>
  dictionaryData.reduce(
    (total, page) => total + (page.rows?.length ?? 0),
    0
  );