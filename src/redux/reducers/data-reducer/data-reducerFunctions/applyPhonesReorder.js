import { chunkIntoPages } from "../../../providers/DragProvider/dragProvider-helpers/commonFunctions";
import { reorderSections, reorderDepartments } from "./reorderHelpers";

export const applyPhonesReorder = (
  state,
  pages,
  deptId
) => {

  if (deptId) {
    return reorderSections(
      state,
      pages,
      deptId
    );
  }

  return reorderDepartments(
    state,
    pages
  );
};