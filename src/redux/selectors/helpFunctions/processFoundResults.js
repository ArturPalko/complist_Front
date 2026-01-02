export const processFoundResults = (foundResults, keysToKeep = ["currentPage", "index"]) => {
  if (!foundResults) return [];

  return foundResults.map(result => {
    const filtered = {};
    for (const key of keysToKeep) {
      if (key in result) filtered[key] = result[key];
    }
    return filtered;
  });
};
