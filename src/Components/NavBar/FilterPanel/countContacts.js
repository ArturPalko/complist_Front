export const countContacts = ({ filteredChunks = [], dataByMenu = [] }) => {
  if (!Array.isArray(filteredChunks)) return 0;

  let totalContacts = 0;
  debugger;

  filteredChunks.forEach((chunk) => {
    chunk.rows.forEach((pos) => {
      const row = dataByMenu?.[pos.page - 1]?.rows?.[pos.index];
      if (row && row.type !== "section" && row.type !== "department") {
        totalContacts += 1;
      }
    });
  });

  return totalContacts;
};
