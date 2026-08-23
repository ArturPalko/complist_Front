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

  const ownerIds =
    editValue.ownerIds ?? [];

  setOwnerIds(ownerIds);

  // =========================
  // SECTION
  // =========================

  if (
    ownerType === "section" &&
    ownerIds.length > 0
  ) {
    const firstSection = sections.find(
      section =>
        Number(section.id) ===
        Number(ownerIds[0])
    );

    if (firstSection) {
      setSectionDepartmentId(
        firstSection.departmentId
      );
    }
  }

  setId(
    editValue.id ?? ""
  );

  setPasswordKnown(
    editValue.passwordKnown ?? false
  );

  setResponsibleUserIds(
    editValue.responsibleUsers?.map(
      user => user.id
    ) ?? []
  );

  if (ownerType === "user") {
    setQuery(
      editValue.owner ?? ""
    );
  }
};