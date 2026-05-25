export const extractPositionsAndTypes = (phones) => {
  const contactTypes = new Set();
  const positionsMap = new Map();

  if (!Array.isArray(phones)) {
    return { contactTypes: [], userPositions: [] };
  }

  phones.forEach(page => {
    if (!Array.isArray(page.rows)) return;

    page.rows.forEach(row => {
      if (row.type !== "user") return;

      if (row.userType) {
        contactTypes.add(row.userType);
      }debugger

      if (row.userType === "Користувач" && row.userPosition) {
        // key = position name (dedup)
        if (!positionsMap.has(row.userPosition)) {
          positionsMap.set(row.userPosition, {
            name: row.userPosition,
            priority: row.userPositionPriority ?? 9999
          });
        }
      }
    });
  });

  const userPositions = Array.from(positionsMap.values())
    .sort((a, b) => a.priority - b.priority)
    .map(p => p.name);

  return {
    contactTypes: Array.from(contactTypes),
    userPositions
  };
};

