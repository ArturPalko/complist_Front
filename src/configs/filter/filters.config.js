import { Pages } from "../app/constants";

export const FilterKeys = {
  PERSONAL_MAILS: "personalMails",
  DEPARTMENT_MAILS: "departmentMails",
  SECTION_MAILS: "sectionMails",

  HAS_RESPONSIBLE: "hasResponsible",
  PASSWORD_KNOWN: "passwordKnown",

  HAS_NEW_POST_NAME: "hasNewPostName",
  HAS_PREVIOUS_NAME: "hasPreviousName",

  HAS_LANDLINE_PHONE: "hasLandlinePhone",
  HAS_INTERNAL_PHONE: "hasInternalPhone",
  HAS_CISCO_PHONE: "hasCiscoPhone",
};

export const FILTER_GROUPS_NAMES = {
  OWNER: "Власник",
  POSITIVE: "Позитивна властивість",
  NEGATIVE: "Негативна властивість",
};

export const pageFiltersKeys = {
  [Pages.GOV_UA]: [
    FilterKeys.PERSONAL_MAILS,
    FilterKeys.DEPARTMENT_MAILS,
    FilterKeys.SECTION_MAILS,
    FilterKeys.HAS_RESPONSIBLE,
    FilterKeys.PASSWORD_KNOWN,
  ],

  [Pages.LOTUS]: [
    FilterKeys.PERSONAL_MAILS,
    FilterKeys.DEPARTMENT_MAILS,
    FilterKeys.SECTION_MAILS,
    FilterKeys.HAS_RESPONSIBLE,
    FilterKeys.PASSWORD_KNOWN,
    FilterKeys.HAS_NEW_POST_NAME,
    FilterKeys.HAS_PREVIOUS_NAME,
  ],

  [Pages.PHONES]: [
    FilterKeys.HAS_LANDLINE_PHONE,
    FilterKeys.HAS_INTERNAL_PHONE,
    FilterKeys.HAS_CISCO_PHONE,
  ],
};