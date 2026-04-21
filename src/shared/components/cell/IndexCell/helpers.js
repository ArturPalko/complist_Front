export const getIndexesForSection = (foundResults, currentIndex,targetPage) => {
  const result = [];

  for (let i = currentIndex + 1; i < foundResults.length; i++) {
    const item = foundResults[i];

    if (
      item.currentPage !== targetPage||
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