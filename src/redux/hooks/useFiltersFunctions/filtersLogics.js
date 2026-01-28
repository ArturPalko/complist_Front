import { Pages, FILTER_GROUPS_NAMES } from "../../selectors/constants";

// -------------------- CONDITIONS --------------------
const conditionsWithoutNegative = {
  personalMails: (el) => el.ownerType === "User",
  departmentMails: (el) => el.ownerType === "Department",
  sectionMails: (el) => el.ownerType === "Section",
};

const conditionsWithNegative = {
  hasResponsible: (el) => el.responsibleUser !== "",
  passwordKnown: (el) => el.passwordKnown === true,
  hasNewPostName: (el) => el.name != null,
  hasPrevioustName: (el) => el.previousName !== null,
  hasLandlinePhone: (el) => el.phones?.some((p) => p.phoneType === "Міський"),
  hasInternalPhone: (el) => el.phones?.some((p) => p.phoneType === "Внутрішній"),
  hasCiscoPhone: (el) => el.phones?.some((p) => p.phoneType === "IP (Cisco)"),
};

// -------------------- NEGATIVE CONDITIONS --------------------
const negativeConditions = Object.fromEntries(
  Object.entries(conditionsWithNegative).map(([key, fn]) => [
    `NOT${key.charAt(0).toUpperCase() + key.slice(1)}`,
    (el) => !fn(el),
  ])
);

// -------------------- EXPORT CONDITIONS --------------------
export const conditions = {
  ...conditionsWithoutNegative,
  ...conditionsWithNegative,
  ...negativeConditions,
};

// -------------------- FILTER GROUPS --------------------
const manualGroups = {
  personalMails: ["departmentMails", "sectionMails"],
};

const autoGroups = Object.fromEntries(
  Object.keys(conditionsWithNegative).map((key) => [
    key,
    [`NOT${key.charAt(0).toUpperCase() + key.slice(1)}`],
  ])
);

export const filterGroups = {
  ...manualGroups,
  ...autoGroups,
};

// -------------------- FRIENDLY LABELS --------------------
const friendlyLabels = {
  personalMails: "Персональні",
  departmentMails: "Самостійного підрозділу",
  sectionMails: "(Не) самостійного підрозділу",
  hasResponsible: "Має відповідальну особу",
  passwordKnown: "Пароль відомий",
  hasPrevioustName: "Має стару назву",
  hasNewPostName: "Має нову назву",
  hasLandlinePhone: "має Міський телефон",
  hasInternalPhone: "має Внутрішній телефон",
  hasCiscoPhone: "має IP Cisco телефон",
};

// -------------------- OWNER FILTERS --------------------
const ownerFilters = ["personalMails", "departmentMails", "sectionMails"];

// -------------------- PAGE-BASED KEYS --------------------
const pageFiltersKeys = {
  [Pages.GOV_UA]: [
    "personalMails",
    "departmentMails",
    "sectionMails",
    "hasResponsible",
    "passwordKnown",
  ],
  [Pages.LOTUS]: [
    "personalMails",
    "departmentMails",
    "sectionMails",
    "hasNewPostName",
    "hasPrevioustName",
    "passwordKnown",
  ],
  [Pages.PHONES]: ["hasLandlinePhone", "hasInternalPhone", "hasCiscoPhone"],
};

// -------------------- GENERATE FILTER POINTS --------------------
export const filterPoints = Object.fromEntries(
  Object.entries(pageFiltersKeys).map(([page, keys]) => {
    const owner = keys
      .filter((k) => ownerFilters.includes(k))
      .map((k) => ({ key: k, label: friendlyLabels[k] }));

    const positive = keys
      .filter((k) => conditionsWithNegative[k])
      .map((k) => ({ key: k, label: friendlyLabels[k] }));

    const negative = keys
      .filter((k) => conditionsWithNegative[k])
      .map((k) => {
        const negKey = `NOT${k.charAt(0).toUpperCase() + k.slice(1)}`;
        return { key: negKey, label: `(НЕ) ${friendlyLabels[k]}` };
      });

    const result = {};
    if (owner.length) result[FILTER_GROUPS_NAMES.OWNER] = owner;
    if (positive.length) result[FILTER_GROUPS_NAMES.POSITIVE] = positive;
    if (negative.length) result[FILTER_GROUPS_NAMES.NEGATIVE] = negative;

    return [page, result];
  })
);
