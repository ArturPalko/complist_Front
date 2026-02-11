// filters.config.js
import { Pages } from "../../../../../configs/app/constants";

export const ownerFilters = [
  "personalMails",
  "departmentMails",
  "sectionMails",
];

export const pageFiltersKeys = {
  [Pages.GOV_UA]: [
    ...ownerFilters,
    "hasResponsible",
    "passwordKnown",
  ],
  [Pages.LOTUS]: [
    ...ownerFilters,
    "hasNewPostName",
    "hasPrevioustName",
    "passwordKnown",
  ],
  [Pages.PHONES]: [
    "hasLandlinePhone",
    "hasInternalPhone",
    "hasCiscoPhone",
  ],
};
