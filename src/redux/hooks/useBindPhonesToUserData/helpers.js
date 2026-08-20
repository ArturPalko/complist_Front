export const EMPTY_PHONE_VALUES = {
  landline: "",
  internal: "",
  cisco: "",
};

export const flattenPages = (pages = []) =>
  pages.flatMap((page) => page.rows ?? []);

export const getPhoneOptions = (
  landlines,
  internals,
  ciscos
) => ({
  landline: flattenPages(landlines),
  internal: flattenPages(internals),
  cisco: flattenPages(ciscos),
});

export const hasPhoneForUser = (
  phoneOptions,
  userId,
  phoneType
) =>
  phoneOptions[phoneType]?.some((phone) =>
    phone.users?.some(
      (phoneUser) =>
        Number(phoneUser.id) === Number(userId)
    )
  ) ?? false;

export const getTransferUsers = (
  allUsers,
  selectedUserId
) =>
  allUsers.filter(
    (user) =>
      Number(user.id) !== Number(selectedUserId) &&
      user.name
  );