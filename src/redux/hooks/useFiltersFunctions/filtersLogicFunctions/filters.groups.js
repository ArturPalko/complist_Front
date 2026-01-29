// filters.groups.js
import { buildAutoGroups } from "./filters.builders";
import { conditionsWithNegative } from "./filters.conditions";

export const manualGroups = {
  personalMails: ["departmentMails", "sectionMails"],
};

export const filterGroups = {
  ...manualGroups,
  ...buildAutoGroups(Object.keys(conditionsWithNegative)),
};
