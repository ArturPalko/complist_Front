import { isFilterAppliedSelector, getIndexesOfFiltredResults } from "../../redux/selectors/selector";

export const getFilteredPageData = (state, data, menu) => {
  if (!Array.isArray(data)) return { data: [], isFilterApplied: false };

  const isFilterApplied = isFilterAppliedSelector(menu)(state);
  const filtredChunks = getIndexesOfFiltredResults(state, menu);

  if (isFilterApplied) {
    if (!Array.isArray(filtredChunks) || filtredChunks.length === 0) {
      return { data: [], isFilterApplied: true };
    }

    const mappedChunks = filtredChunks
      .map(chunk => {
        const rows = chunk.rows
          .map(row => {
            const page = data.find(p => p.pageIndex === row.page);
            return page?.rows?.[row.index] ?? null;
          })
          .filter(Boolean);

        return rows.length > 0 ? { pageIndex: chunk.pageIndex, rows } : null;
      })
      .filter(Boolean);

    return { data: mappedChunks, isFilterApplied: true };
  }

  return { data, isFilterApplied: false };
};