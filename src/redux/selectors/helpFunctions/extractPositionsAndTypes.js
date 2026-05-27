export const extractPositionsAndTypes = (phones) => {

  const contactTypesMap = new Map();
  const positionsMap = new Map();

  if (!Array.isArray(phones)) {
    return {
      contactTypes: [],
      userPositions: []
    };
  }

  phones.forEach(page => {

    if (!Array.isArray(page.rows)) return;

    page.rows.forEach(row => {

      if (row.type !== "user") return;

      // ========================================
      // USER TYPES
      // ========================================

      if (
        row.userType &&
        row.userTypeId != null
      ) {

        if (!contactTypesMap.has(row.userTypeId)) {

          contactTypesMap.set(
            row.userTypeId,
            {
              type: "userType",
              id: row.userTypeId,
              userType: row.userType,
              priority:
                row.userTypePriority ?? 9999
            }
          );
        }
      }

      // ========================================
      // POSITIONS
      // ========================================

      if (
        row.userType === "Користувач" &&
        row.userPosition &&
        row.userPositionId != null
      ) {

        if (!positionsMap.has(row.userPositionId)) {

          positionsMap.set(
            row.userPositionId,
            {
              type: "position",
              id: row.userPositionId,
              positionName: row.userPosition,
              priority:
                row.userPositionPriority ?? 9999
            }
          );
        }
      }
    });
  });

  return {

    contactTypes: Array
      .from(contactTypesMap.values())
      .sort((a, b) =>
        a.priority - b.priority
      ),

    userPositions: Array
      .from(positionsMap.values())
      .sort((a, b) =>
        a.priority - b.priority
      )
  };
};