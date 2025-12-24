export const countContacts = ({ filteredChunks = [], dataByMenu = [] }) => {
  if (!Array.isArray(filteredChunks)) return 0;

  return filteredChunks.reduce((sum, chunk) => {
    const minus = chunk.rows.reduce((acc, pos) => {
      const row = dataByMenu?.[pos.page - 1]?.rows?.[pos.index];
      return row?.type === "section" || row?.type === "department"
        ? acc + 1
        : acc;
    }, 0);

    return sum + (chunk.rows.length - minus);
  }, 0);
};
