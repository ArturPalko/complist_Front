export const getIndexesForSection = (foundResults, currentIndex, page) => {
  const result = [];

  for (let i = currentIndex + 1; i < foundResults.length; i++) {
    const item = foundResults[i];

    // пропускаємо інші сторінки, але НЕ ламаємо цикл
    if (item.currentPage !== page) break;

    if (
      item.elementType === "section" ||
      item.elementType === "department"
    ) {
      break;
    }

    if (item.elementType === "user") {
      result.push(item.index);
    }
  }

  return result;
};