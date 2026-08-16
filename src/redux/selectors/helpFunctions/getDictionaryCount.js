
export const getDictionaryCount = (
  currentMode,
  count,
  activeDepartmentId,
  activeSectionId
) => {
  if (currentMode === "landline") {
    return { countOfLandlinePhones: count };
  }

  if (currentMode === "internal") {
    return { countOfInternalPhones: count };
  }

  if (currentMode === "cisco") {
    return { countOfCiscoPhones: count };
  }

  if (currentMode === "positions" || currentMode === "userTypes") {
    return { countOfUsers: count };
  }

  if (currentMode === "departments") {
    return activeDepartmentId != null
      ? { countOfUsers: count }
      : { countOfDepartments: count };
  }

  if (currentMode === "sections") {
    if (activeSectionId != null) {
      return { countOfUsers: count };
    }

    if (activeDepartmentId != null) {
      return { countOfSections: count };
    }

    return { countOfDepartments: count };
  }

  return null;
};