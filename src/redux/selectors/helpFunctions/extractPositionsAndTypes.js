export const extractPositionsAndTypes = (phones) => {
  const contactTypes = [];
  const userPositions = [];

  if (!Array.isArray(phones) || phones.length === 0) {
    return { contactTypes: [], userPositions: [] };
  }

  phones.forEach(element => {
    if (!Array.isArray(element.rows)) return;

    element.rows.forEach(row => {
      if (row.type === "user") {
        if (!contactTypes.includes(row.userType)) {
          contactTypes.push(row.userType);
        }

        if (row.userType === "Користувач" && !userPositions.includes(row.userPosition)) {
          if (row.userPosition === undefined) console.log("Пустий рядок:", row);
          userPositions.push(row.userPosition);
        }
      }
    });
  });

  return { contactTypes, userPositions };
};
