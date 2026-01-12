// utils/countPhoneData.js

// Підрахунок унікальних телефонів
export const selectUniqueCount = (phones) =>
  new Set(phones.map(p => `${p.phoneType}-${p.phoneName}`)).size;

// Підрахунок телефонів з деталізацією по типах та ролях
export const countPhoneData = (phonesData = []) => {
  let internalPhones = [];
  let landLinePhones = [];
  let ciscoPhones = [];

  let countOfDepartments = 0;
  let countOfSections = 0;
  let countOfUsers = 0;

  phonesData.forEach(element => {
    element.rows.forEach(row => {
      if (!row.type) return;

      switch (row.type) {
        case "department":
          countOfDepartments++;
          break;
        case "section":
          countOfSections++;
          break;
        case "user":
          countOfUsers++;
          row.phones?.forEach(phone => {
            switch (phone.phoneType) {
              case "Внутрішній":
                internalPhones.push(phone);
                break;
              case "Міський":
                landLinePhones.push(phone);
                break;
              case "IP (Cisco)":
                ciscoPhones.push(phone);
                break;
            }
          });
          break;
      }
    });
  });

  return {
    countOfDepartments,
    countOfSections,
    countOfUsers,
    countOfLandlinePhones: selectUniqueCount(landLinePhones),
    countOfCiscoPhones: selectUniqueCount(ciscoPhones),
    countOfInternalPhones: selectUniqueCount(internalPhones)
  };
};
