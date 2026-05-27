import {
  reorderSections,
  reorderDepartments,
  orderByPositions,
  orderByUserTypes
} from "./reorderHelpers";

export const applyPhonesReorder = (
  state,
  pages,
  deptId,
  currentMode
) => {

  switch (currentMode) {

    case "positions":
      return orderByPositions(state, pages);

    case "userTypes":
      return orderByUserTypes(state, pages);

    case "sections":
      return reorderSections(state, pages, deptId);

    case "departments":
    default:
      return reorderDepartments(state, pages);
  }
};