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

export const filters = {
  [FilterKeys.PERSONAL_MAILS]: {
    label: "Персональні",
    group: FILTER_GROUPS_NAMES.OWNER,
    condition: (el) => el.ownerType === "User",
  },
  [FilterKeys.DEPARTMENT_MAILS]: {
    label: "Самостійного підрозділу",
    group: FILTER_GROUPS_NAMES.OWNER,
    condition: (el) => el.ownerType === "Department",
  },
  [FilterKeys.SECTION_MAILS]: {
    label: "(Не) самостійного підрозділу",
    group: FILTER_GROUPS_NAMES.OWNER,
    condition: (el) => el.ownerType === "Section",
  },
  [FilterKeys.HAS_RESPONSIBLE]: {
    label: "Має відповідальну особу",
    group: FILTER_GROUPS_NAMES.POSITIVE,
    condition: (el) => el.responsibleUser !== "",
  },
  [FilterKeys.PASSWORD_KNOWN]: {
    label: "Пароль відомий",
    group: FILTER_GROUPS_NAMES.POSITIVE,
    condition: (el) => !!el.passwordKnown,
  },
  [FilterKeys.HAS_NEW_POST_NAME]: {
    label: "Має нову назву",
    group: FILTER_GROUPS_NAMES.POSITIVE,
    condition: (el) => el.name != null,
  },
  [FilterKeys.HAS_PREVIOUS_NAME]: {
    label: "Має стару назву",
    group: FILTER_GROUPS_NAMES.NEGATIVE,
    condition: (el) => el.previousName != null,
  },
  [FilterKeys.HAS_LANDLINE_PHONE]: {
    label: "Має Міський телефон",
    group: FILTER_GROUPS_NAMES.POSITIVE,
    condition: (el) => el.phones?.some((p) => p.phoneType === "Міський"),
  },
  [FilterKeys.HAS_INTERNAL_PHONE]: {
    label: "Має Внутрішній телефон",
    group: FILTER_GROUPS_NAMES.POSITIVE,
    condition: (el) => el.phones?.some((p) => p.phoneType === "Внутрішній"),
  },
  [FilterKeys.HAS_CISCO_PHONE]: {
    label: "Має IP Cisco телефон",
    group: FILTER_GROUPS_NAMES.POSITIVE,
    condition: (el) => el.phones?.some((p) => p.phoneType === "IP (Cisco)"),
  },
};

// Масиви ключів для кожної сторінки – це порядок рендерингу
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
