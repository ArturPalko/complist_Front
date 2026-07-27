export const initializeEditForm = (editValue, setters) => {
  if (!editValue) {
    return;
  }

  const {
    setMail,
    setPreviousName,
    setOwnerType,
    setOwnerId,
    setId,
    setPasswordKnown,
    setResponsibleUserIds,
    setQuery,
  } = setters;

  setMail(
    editValue.mailName ??
    editValue.name ??
    ""
  );

  setPreviousName(
    editValue.previousName ?? ""
  );

  const ownerType =
    editValue.ownerType?.toLowerCase() ??
    "department";

  setOwnerType(ownerType);

  setOwnerId(
    editValue.ownerId ?? ""
  );

  setId(
    editValue.id ?? ""
  );

  setPasswordKnown(
    editValue.passwordKnown ?? false
  );

  setResponsibleUserIds(
    editValue.responsibleUsers?.map(user => user.id) ?? []
  );

  if (ownerType === "user") {
    setQuery(
      editValue.owner ?? ""
    );
  }
};