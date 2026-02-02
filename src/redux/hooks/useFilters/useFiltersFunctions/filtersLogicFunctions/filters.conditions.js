// filters.conditions.js
export const conditionsWithoutNegative = {
  personalMails: (el) => el.ownerType === "User",
  departmentMails: (el) => el.ownerType === "Department",
  sectionMails: (el) => el.ownerType === "Section",
};

export const conditionsWithNegative = {
  hasResponsible: (el) => el.responsibleUser !== "",
  passwordKnown: (el) => el.passwordKnown === true,
  hasNewPostName: (el) => el.name != null,
  hasPrevioustName: (el) => el.previousName !== null,
  hasLandlinePhone: (el) =>
    el.phones?.some((p) => p.phoneType === "Міський"),
  hasInternalPhone: (el) =>
    el.phones?.some((p) => p.phoneType === "Внутрішній"),
  hasCiscoPhone: (el) =>
    el.phones?.some((p) => p.phoneType === "IP (Cisco)"),
};
