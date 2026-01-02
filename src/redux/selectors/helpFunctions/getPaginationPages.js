export const getPaginationPages = (state, activeMenu) => {
  if (activeMenu === "phones") {
    return state.phones?.pages;
  }

  const mailsMap = {
    Lotus: "lotus",
    "Gov-ua": "gov-ua",
  };

  return state.mails?.[mailsMap[activeMenu]];
};
