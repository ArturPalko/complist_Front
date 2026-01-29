// filters/index.js
import { FILTER_GROUPS_NAMES } from "../../selectors/constants";

import {
  conditionsWithoutNegative,
  conditionsWithNegative,
} from "./filtersLogicFunctions/filters.conditions";
import { buildNegativeConditions, buildFilterPointsForPage } from "./filtersLogicFunctions/filters.builders";
import { pageFiltersKeys, ownerFilters } from "./filtersLogicFunctions/filters.config";
import { friendlyLabels } from "./filtersLogicFunctions/filters.labels";
import { filterGroups } from "./filtersLogicFunctions/filters.groups";

// CONDITIONS
export const conditions = {
  ...conditionsWithoutNegative,
  ...conditionsWithNegative,
  ...buildNegativeConditions(conditionsWithNegative),
};

// FILTER POINTS
export const filterPoints = Object.fromEntries(
  Object.entries(pageFiltersKeys).map(([page, keys]) => [
    page,
    buildFilterPointsForPage({
      keys,
      ownerKeys: ownerFilters,
      labels: friendlyLabels,
      withNegative: conditionsWithNegative,
      groupNames: FILTER_GROUPS_NAMES,
    }),
  ])
);

export { filterGroups };
