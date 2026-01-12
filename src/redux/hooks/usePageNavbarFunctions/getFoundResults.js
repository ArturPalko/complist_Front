export const getFoundResults = (pageName, foundPhones, foundLotus, foundGovUa) => {
  switch(pageName) {
    case "phones": return foundPhones?.foundResults || [];
    case "Lotus": return foundLotus?.foundResults || [];
    case "Gov-ua": return foundGovUa?.foundResults || [];
    default: return [];
  }
};
