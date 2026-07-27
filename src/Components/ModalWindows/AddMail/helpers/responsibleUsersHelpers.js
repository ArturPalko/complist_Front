export const addResponsibleUser = ({
  userId,
  responsibleUserIds,
  setResponsibleUserIds,
  setResponsibleQuery,
  setResponsibleOpened,
}) => {
  if (responsibleUserIds.includes(userId)) {
    return;
  }

  setResponsibleUserIds(prev => [
    ...prev,
    userId,
  ]);

  setResponsibleQuery("");
  setResponsibleOpened(false);
};

export const removeResponsibleUser = ({
  userId,
  setResponsibleUserIds,
}) => {
  setResponsibleUserIds(prev =>
    prev.filter(id => id !== userId)
  );
};