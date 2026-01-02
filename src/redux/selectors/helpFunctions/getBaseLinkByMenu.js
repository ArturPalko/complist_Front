// варіант 2 — default export
export const getBaseLinkByMenu = (menu) => {
  switch (menu) {
    case "Lotus": return "/mails/Lotus";
    case "Gov-ua": return "/mails/Gov-ua";
    case "phones": return "/phones";
    default: return "";
  }
};


