export const getCountAndIsApplied = (pageName, countFiltred, pagesCount, isFilterApplied) => {
  let c = countFiltred[pageName] || pagesCount;
  const applied = isFilterApplied[pageName] || false;
  if ((!c || c.length === 0) && !applied) c = pagesCount;
  return { count: c, isApplied: applied };
};
