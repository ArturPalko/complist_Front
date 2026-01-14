// Підрахунок унікальних телефонів
export const selectUniqueCount = (phones) =>
  new Set(phones.map(p => `${p.phoneType}-${p.phoneName}`)).size;

// Підрахунок поштових даних
export const countMailData = (data) => {
  let countOfMails = 0;
  let personalMails = 0;
  let departmentMails = 0;
  let sectionMails = 0;
  let hasNewPostName = 0;
  let passwordKnown = 0;
  let hasResponsibleUser = 0;

  data?.forEach(element => {
    countOfMails += element.rows.length;
    element.rows.forEach(row => {
      if (row.name != null) hasNewPostName++;
      if (row.passwordKnown !== false) passwordKnown++;
      if (row.responsibleUser) hasResponsibleUser++;

      switch (row.ownerType) {
        case "User": personalMails++; break;
        case "Department": departmentMails++; break;
        case "Section": sectionMails++; break;
      }
    });
  });

  return {
    countOfMails,
    personalMails,
    departmentMails,
    sectionMails,
    hasNewPostName,
    passwordKnown,
    hasResponsibleUser
  };
};
