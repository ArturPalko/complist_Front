export const getPaginationPages = (state, activeMenu) => {
  if (activeMenu === "phones") {
    return state.phones?.pages;
  }

  return state.mails?.[activeMenu];
};
