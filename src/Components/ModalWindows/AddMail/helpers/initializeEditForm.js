
export const initializeEditForm = (
  editValue,
  setters,
  sections = []
) => {
  if (!editValue) {
    return;
  }

  const {
    setMail,
    setPreviousName,
    setOwnerType,
    setOwnerId,
    setOwnerIds,
    setSectionDepartmentId,
    setOwnerDisplayName,
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
    editValue.ownerType?.trim().toLowerCase() ||
    "none";

  setOwnerType(ownerType);

  setOwnerId(
    editValue.ownerId && editValue.ownerId !== 0
      ? editValue.ownerId
      : ""
  );

  const ownerIds =
    editValue.ownerIds ?? [];

  setOwnerIds(ownerIds);

  setOwnerDisplayName(
    editValue.ownerDisplayName ?? ""
  );

  // Очищаємо залежне значення перед
  // визначенням департаменту для секції.
  setSectionDepartmentId("");

  setQuery("");

  if (
    ownerType === "section" &&
    ownerIds.length > 0
  ) {
    const firstSection = sections.find(
      (section) =>
        Number(section.id) ===
        Number(ownerIds[0])
    );

    if (firstSection) {
      setSectionDepartmentId(
        firstSection.departmentId
      );
    }
  }

  if (ownerType === "user") {
    setQuery(
      editValue.owner ?? ""
    );
  }

  setId(
    editValue.id ?? ""
  );

  setPasswordKnown(
    editValue.passwordKnown ?? false
  );

  setResponsibleUserIds(
    editValue.responsibleUsers?.map(
      (user) => user.id
    ) ?? []
  );
};

